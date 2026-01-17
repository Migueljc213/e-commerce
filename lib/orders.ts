// Mock data storage (in-memory for deployment without database)
const mockOrders: any[] = []
const mockPayments: any[] = []

// Check if we should use mock data (when DATABASE_URL is not set or invalid)
// In Vercel without database, DATABASE_URL won't be set or will be empty
const useMockData = !process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '' || 
  process.env.USE_MOCK_DATA === 'true'

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
  // Use mock data if no database is configured
  if (useMockData) {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const order = {
      id: orderId,
      userId: data.userId || null,
      externalReference: `order_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      preferenceId: null,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal: data.subtotal,
      discount: data.discount,
      shipping: data.shipping,
      total: data.total,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      shippingStreet: data.shippingStreet,
      shippingCity: data.shippingCity,
      shippingState: data.shippingState,
      shippingZipCode: data.shippingZipCode,
      shippingCountry: data.shippingCountry || 'Brasil',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: data.items.map((item) => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        orderId: orderId,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null,
      })),
      payments: [],
    }
    
    // Store in mock storage
    mockOrders.push(order)
    
    return order
  }

  // Use real database if available
  const { prisma } = await import('./db')
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
  if (useMockData) {
    const orderIndex = mockOrders.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      mockOrders[orderIndex] = {
        ...mockOrders[orderIndex],
        status,
        ...(paymentStatus && { paymentStatus }),
        updatedAt: new Date(),
      }
      return mockOrders[orderIndex]
    }
    throw new Error('Order not found')
  }

  const { prisma } = await import('./db')
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
  if (useMockData) {
    return mockOrders.find(o => o.externalReference === externalReference) || null
  }

  const { prisma } = await import('./db')
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
  if (useMockData) {
    return mockOrders.find(o => o.id === orderId) || null
  }

  const { prisma } = await import('./db')
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
  if (useMockData) {
    const payment = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      orderId: data.orderId,
      mercadoPagoId: data.mercadoPagoId,
      status: data.status,
      statusDetail: data.statusDetail || null,
      paymentMethodId: data.paymentMethodId || null,
      paymentTypeId: data.paymentTypeId || null,
      transactionAmount: data.transactionAmount,
      currencyId: data.currencyId || 'BRL',
      description: data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: mockOrders.find(o => o.id === data.orderId) || null,
    }
    
    mockPayments.push(payment)
    return payment
  }

  const { prisma } = await import('./db')
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
  if (useMockData) {
    const paymentIndex = mockPayments.findIndex(p => p.id === paymentId)
    if (paymentIndex !== -1) {
      mockPayments[paymentIndex] = {
        ...mockPayments[paymentIndex],
        status,
        ...(statusDetail && { statusDetail }),
        updatedAt: new Date(),
      }
      return mockPayments[paymentIndex]
    }
    throw new Error('Payment not found')
  }

  const { prisma } = await import('./db')
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
  if (useMockData) {
    return mockPayments.find(p => p.mercadoPagoId === mercadoPagoId) || null
  }

  const { prisma } = await import('./db')
  const payment = await prisma.payment.findUnique({
    where: { mercadoPagoId },
    include: {
      order: true,
    },
  })

  return payment
}



