import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createOrder } from '@/lib/orders'

// Inicializar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc',
  },
})

const preference = new Preference(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, user, discount = 0, userId } = body

    // Validar dados
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    // Calcular totais
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shippingCost = 15.0
    const finalTotal = subtotal - discount + shippingCost

    // Criar pedido no banco de dados ANTES de criar a preferência
    const order = await createOrder({
      userId: userId || undefined,
      items: items.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      discount,
      shipping: shippingCost,
      total: finalTotal,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      shippingStreet: shippingAddress.street,
      shippingCity: shippingAddress.city,
      shippingState: shippingAddress.state,
      shippingZipCode: shippingAddress.zipCode,
      shippingCountry: shippingAddress.country || 'Brasil',
    })

    // Preparar itens para o Mercado Pago
    const preferenceItems = items.map((item: any) => ({
      id: item.id,
      title: item.name,
      description: item.description || item.name,
      quantity: item.quantity,
      currency_id: 'BRL',
      unit_price: item.price,
      picture_url: item.image,
    }))

    // Criar preferência de pagamento
    const preferenceData = {
      items: preferenceItems,
      payer: {
        name: user.name,
        email: user.email,
        phone: {
          area_code: '',
          number: user.phone || '',
        },
        address: shippingAddress
          ? {
              street_name: shippingAddress.street,
              city_name: shippingAddress.city,
              state_name: shippingAddress.state,
              zip_code: shippingAddress.zipCode,
            }
          : undefined,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?preference_id={preference_id}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure?preference_id={preference_id}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/pending?preference_id={preference_id}`,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12,
      },
      shipments: {
        cost: shippingCost,
        mode: 'not_specified',
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/webhook`,
      statement_descriptor: 'ECOMMERCE STORE',
      external_reference: order.externalReference, // Usar a referência do pedido criado
    }

    const response = await preference.create({ body: preferenceData })

    // Atualizar o pedido com o ID da preferência
    const { prisma } = await import('@/lib/db')
    await prisma.order.update({
      where: { id: order.id },
      data: { preferenceId: response.id },
    })

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      orderId: order.id,
      externalReference: order.externalReference,
    })
  } catch (error: any) {
    console.error('Error creating payment preference:', error)
    return NextResponse.json(
      {
        error: 'Error creating payment preference',
        message: error.message,
      },
      { status: 500 }
    )
  }
}


