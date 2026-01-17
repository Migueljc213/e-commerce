import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// MODO MOCK: Retorna dados simulados sem chamar o MercadoPago real
const USE_REAL_MERCADOPAGO = process.env.USE_MERCADOPAGO_REAL === 'true'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('payment_id')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // MODO MOCK: Retornar dados simulados (pagamento sempre aprovado no mock)
    if (!USE_REAL_MERCADOPAGO) {
      // Simular um ID de pagamento mockado
      const mockPaymentId = paymentId.startsWith('mock_') ? paymentId : `mock_payment_${Date.now()}`
      
      return NextResponse.json({
        id: mockPaymentId,
        status: 'approved',
        status_detail: 'accredited',
        external_reference: searchParams.get('external_reference') || `order_${Date.now()}`,
        transaction_amount: parseFloat(searchParams.get('amount') || '0'),
      })
    }

    // CÓDIGO REAL DO MERCADOPAGO (executado apenas se USE_MERCADOPAGO_REAL=true)
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
    const paymentInfo = await payment.get({ id: paymentId })

    return NextResponse.json({
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      external_reference: paymentInfo.external_reference,
      transaction_amount: paymentInfo.transaction_amount,
    })
  } catch (error: any) {
    console.error('Error getting payment status:', error)
    return NextResponse.json(
      { error: 'Error getting payment status', message: error.message },
      { status: 500 }
    )
  }
}




