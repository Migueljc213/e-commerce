import { NextRequest, NextResponse } from 'next/server'
import { findOrderById } from '@/lib/orders'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Helper function to get user ID from request
// In production, this would verify JWT token
function getUserId(request: NextRequest): string | null {
  // Try to get from header (set by client)
  const userId = request.headers.get('x-user-id')
  return userId || null
}

// GET /api/orders - Get orders for a user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    const orderId = request.nextUrl.searchParams.get('orderId')

    // If specific order ID requested
    if (orderId) {
      const order = await findOrderById(orderId)
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      // In production, verify user owns this order
      if (userId && order.userId && order.userId !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      return NextResponse.json(order)
    }

    // Get all orders for user
    const useMockData = !process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '' || 
      process.env.USE_MOCK_DATA === 'true'

    if (useMockData) {
      // Return empty array for mock mode when no userId
      if (!userId) {
        return NextResponse.json([])
      }

      // Mock orders would be stored differently in real implementation
      // For now, return empty - orders will be created through payment flow
      return NextResponse.json([])
    }

    // Use real database
    const { prisma } = await import('@/lib/db')
    
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      {
        error: 'Error fetching orders',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
