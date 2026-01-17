import { NextRequest, NextResponse } from 'next/server'
import {
  findOrderByExternalReference,
  createPayment,
  findPaymentByMercadoPagoId,
  updatePaymentStatus,
  updateOrderStatus,
} from '@/lib/orders'

// MODO MOCK: Não inicializa MercadoPago se estiver em modo mock
const USE_REAL_MERCADOPAGO = process.env.USE_MERCADOPAGO_REAL === 'true'

// Mapear status do Mercado Pago para status do sistema
function mapPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    approved: 'approved',
    pending: 'pending',
    rejected: 'rejected',
    refunded: 'refunded',
    cancelled: 'cancelled',
    in_process: 'pending',
    in_mediation: 'pending',
    charged_back: 'rejected',
  }
  return statusMap[status] || 'pending'
}

// Mapear status de pagamento para status do pedido
function mapOrderStatus(paymentStatus: string): string {
  if (paymentStatus === 'approved') {
    return 'processing'
  }
  if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
    return 'cancelled'
  }
  return 'pending'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'payment') {
      const paymentId = data.id

      let paymentInfo: any

      // MODO MOCK: Usar dados recebidos diretamente sem chamar MercadoPago
      if (!USE_REAL_MERCADOPAGO) {
        paymentInfo = {
          id: data.id || paymentId,
          status: data.status || 'approved',
          status_detail: data.status_detail || 'accredited',
          external_reference: data.external_reference || '',
          transaction_amount: data.transaction_amount || 0,
          payment_method_id: data.payment_method_id || undefined,
          payment_type_id: data.payment_type_id || undefined,
          currency_id: data.currency_id || 'BRL',
          description: data.description || undefined,
        }
      } else {
        // CÓDIGO REAL DO MERCADOPAGO
        let MercadoPagoConfig, Payment
        try {
          const mercadoPagoModule = await import('mercadopago')
          MercadoPagoConfig = mercadoPagoModule.MercadoPagoConfig
          Payment = mercadoPagoModule.Payment
        } catch (error) {
          throw new Error('MercadoPago SDK não está disponível. Certifique-se de que está instalado quando USE_MERCADOPAGO_REAL=true')
        }
        
        const client = new MercadoPagoConfig({
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
        })
        const payment = new Payment(client)
        paymentInfo = await payment.get({ id: paymentId })
      }

      // Verificar se o pagamento já existe no banco
      let dbPayment = await findPaymentByMercadoPagoId(String(paymentInfo.id))

      if (!dbPayment) {
        // Buscar o pedido pela referência externa
        const order = await findOrderByExternalReference(
          paymentInfo.external_reference || ''
        )

        if (!order) {
          console.error('Order not found for external reference:', paymentInfo.external_reference)
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          )
        }

        // Criar novo pagamento no banco
        dbPayment = await createPayment({
          orderId: order.id,
          mercadoPagoId: String(paymentInfo.id),
          status: mapPaymentStatus(paymentInfo.status || 'pending'),
          statusDetail: paymentInfo.status_detail || undefined,
          paymentMethodId: paymentInfo.payment_method_id || undefined,
          paymentTypeId: paymentInfo.payment_type_id || undefined,
          transactionAmount: paymentInfo.transaction_amount || 0,
          currencyId: paymentInfo.currency_id || 'BRL',
          description: paymentInfo.description || undefined,
        })
      } else {
        // Atualizar pagamento existente se o status mudou
        const newStatus = mapPaymentStatus(paymentInfo.status || 'pending')
        if (dbPayment.status !== newStatus) {
          await updatePaymentStatus(
            dbPayment.id,
            newStatus,
            paymentInfo.status_detail || undefined
          )
          dbPayment.status = newStatus
        }
      }

      // Atualizar status do pedido baseado no status do pagamento
      const orderStatus = mapOrderStatus(dbPayment.status)
      const paymentStatus = dbPayment.status

      await updateOrderStatus(dbPayment.orderId, orderStatus, paymentStatus)

      console.log('Payment processed:', {
        paymentId: dbPayment.mercadoPagoId,
        status: dbPayment.status,
        orderId: dbPayment.orderId,
        orderStatus,
      })

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    )
  }
}

// GET para verificação do webhook
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Webhook endpoint' })
}


