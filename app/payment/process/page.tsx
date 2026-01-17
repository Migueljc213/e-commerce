'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FiLock, FiCreditCard, FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useCouponStore } from '@/store/couponStore'

function PaymentProcessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preferenceId = searchParams.get('preference_id')
  const orderId = searchParams.get('order_id')
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const { activeCoupon, calculateDiscount } = useCouponStore()

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card')
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing')

  const subtotal = getTotalPrice()
  const discount = calculateDiscount(subtotal)
  const shipping = subtotal > 0 ? 15.0 : 0
  const finalTotal = subtotal - discount + shipping

  // Se não houver itens no carrinho, redirecionar para produtos
  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push('/products')
    }
  }, [items.length, orderId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      // Simular processamento de pagamento (2-3 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular pagamento bem-sucedido
      const mockPaymentId = `mock_payment_${Date.now()}`
      
      // Simular criação do pagamento no backend (atualizar status do pedido)
      if (orderId) {
        // Fetch order to get external_reference
        try {
          const orderResponse = await fetch(`/api/orders?orderId=${orderId}`)
          let externalReference = orderId
          
          if (orderResponse.ok) {
            const order = await orderResponse.json()
            if (order && order.externalReference) {
              externalReference = order.externalReference
            }
          }
          
          // Simulate webhook call with external_reference
          await fetch(`/api/payment/webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment',
              data: {
                id: mockPaymentId,
                status: 'approved',
                status_detail: 'accredited',
                external_reference: externalReference,
                transaction_amount: finalTotal,
              }
            }),
          })
        } catch (error) {
          // Ignorar erro no modo mock
          console.log('Mock payment: webhook simulation skipped', error)
        }
      }
      
      // Limpar carrinho após pagamento bem-sucedido
      clearCart()
      
      // Redirecionar para página de sucesso
      router.push(`/payment/success?payment_id=${mockPaymentId}&status=approved&preference_id=${preferenceId}&order_id=${orderId || ''}`)
    } catch (error) {
      setPaymentStatus('failed')
      setIsProcessing(false)
      // Redirecionar para página de falha
      router.push(`/payment/failure?preference_id=${preferenceId}&order_id=${orderId || ''}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mercado Pago</h1>
              <p className="text-gray-600 text-sm mt-1">Pagamento seguro</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <FiLock size={20} />
              <span className="text-sm font-semibold">Seguro</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Como você quer pagar?
              </h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'credit_card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiCreditCard size={32} className="mx-auto mb-2 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-900">Cartão</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'pix'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2 bg-primary-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PIX</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">PIX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'boleto'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Boleto</span>
                </button>
              </div>

              {/* Payment Form */}
              {paymentMethod === 'credit_card' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número do cartão
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16)
                        const formatted = value.replace(/(.{4})/g, '$1 ').trim()
                        setCardData({ ...cardData, number: value })
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome no cartão
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry.length >= 2 
                          ? `${cardData.expiry.slice(0, 2)}/${cardData.expiry.slice(2)}`
                          : cardData.expiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                          setCardData({ ...cardData, expiry: value })
                        }}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                          setCardData({ ...cardData, cvv: value })
                        }}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">💡 Modo de Demonstração</p>
                    <p>Este é um ambiente de teste. Use qualquer número de cartão válido para simular o pagamento.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Processando pagamento...
                      </>
                    ) : (
                      <>
                        <FiLock />
                        Pagar R$ {finalTotal.toFixed(2).replace('.', ',')}
                      </>
                    )}
                  </button>
                </form>
              )}

              {paymentMethod === 'pix' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-green-300">
                        <span className="text-4xl">QR</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Escaneie o QR Code com o app do seu banco
                    </p>
                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Processando...' : 'Simular Pagamento PIX'}
                    </button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">💡 Modo de Demonstração</p>
                    <p>No ambiente real, um QR Code seria exibido aqui para pagamento via PIX.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'boleto' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      O boleto será gerado após a confirmação do pedido. Você receberá por email.
                    </p>
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Código de Barras (Simulado)</p>
                      <p className="font-mono text-sm">34191.09008 01234.567890 12345.678901 2 12345678901234</p>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Processando...' : 'Simular Geração de Boleto'}
                    </button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">💡 Modo de Demonstração</p>
                    <p>No ambiente real, um boleto bancário válido seria gerado aqui.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do pedido</h2>
              
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>R$ {shipping.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <FiLock className="text-green-600" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-600" />
                  <span>Proteção do Mercado Pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentProcessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiLoader className="mx-auto text-primary-600 animate-spin mb-4" size={64} />
            <p className="text-xl text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentProcessContent />
    </Suspense>
  )
}

