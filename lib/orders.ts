import { prisma } from './db'

export interface CreateOrderData {
  userId?: string
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
    image?: string
  }>
  subtotal: number
  discount: number
  shipping: number
  total: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingStreet: string
  shippingCity: string
  shippingState: string
  shippingZipCode: string
  shippingCountry?: string
}

export async function createOrder(data: CreateOrderData) {
  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      externalReference: `order_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal: data.subtotal,
      discount: data.discount,
      shipping: data.shipping,
      total: data.total,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingStreet: data.shippingStreet,
      shippingCity: data.shippingCity,
      shippingState: data.shippingState,
      shippingZipCode: data.shippingZipCode,
      shippingCountry: data.shippingCountry || 'Brasil',
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    },
    include: {
      items: true,
    },
  })

  return order
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(paymentStatus && { paymentStatus }),
    },
  })

  return order
}

export async function findOrderByExternalReference(externalReference: string) {
  const order = await prisma.order.findUnique({
    where: { externalReference },
    include: {
      items: true,
      payments: true,
    },
  })

  return order
}

export async function findOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payments: true,
    },
  })

  return order
}

export async function createPayment(data: {
  orderId: string
  mercadoPagoId: string
  status: string
  statusDetail?: string
  paymentMethodId?: string
  paymentTypeId?: string
  transactionAmount: number
  currencyId?: string
  description?: string
}) {
  const payment = await prisma.payment.create({
    data: {
      orderId: data.orderId,
      mercadoPagoId: data.mercadoPagoId,
      status: data.status,
      statusDetail: data.statusDetail,
      paymentMethodId: data.paymentMethodId,
      paymentTypeId: data.paymentTypeId,
      transactionAmount: data.transactionAmount,
      currencyId: data.currencyId || 'BRL',
      description: data.description,
    },
  })

  return payment
}

export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  statusDetail?: string
) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status,
      statusDetail,
    },
  })

  return payment
}

export async function findPaymentByMercadoPagoId(mercadoPagoId: string) {
  const payment = await prisma.payment.findUnique({
    where: { mercadoPagoId },
    include: {
      order: true,
    },
  })

  return payment
}



