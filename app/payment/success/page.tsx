'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiCheckCircle, FiPackage, FiHome, FiLoader } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const [paymentStatus, setPaymentStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const preferenceId = searchParams.get('preference_id')
    const status = searchParams.get('status')

    if (paymentId) {
      // Verificar status do pagamento
      fetch(`/api/payment/status?payment_id=${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          setPaymentStatus(data)
          setIsLoading(false)

          // Se o pagamento foi aprovado, limpar o carrinho
          if (data.status === 'approved') {
            clearCart()
            // Remover pedido pendente do sessionStorage
            sessionStorage.removeItem('pendingOrder')
          }
        })
        .catch((error) => {
          console.error('Error checking payment status:', error)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [searchParams, clearCart])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <FiLoader className="mx-auto text-primary-600 animate-spin mb-4" size={64} />
          <p className="text-xl text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    )
  }

  const isApproved = paymentStatus?.status === 'approved' || searchParams.get('status') === 'approved'

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {isApproved ? (
          <>
            <div className="mb-8">
              <FiCheckCircle size={80} className="mx-auto text-green-500 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Pagamento Aprovado!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Obrigado por sua compra!
              </p>
              {paymentStatus?.external_reference && (
                <p className="text-gray-600">
                  Número do pedido: <span className="font-semibold">{paymentStatus.external_reference}</span>
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FiPackage className="text-primary-600" size={24} />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Próximos Passos
                </h2>
              </div>
              <div className="text-left space-y-3 text-gray-600">
                <p>✓ Você receberá um email de confirmação em breve</p>
                <p>✓ Seu pedido será processado e enviado em até 2 dias úteis</p>
                <p>✓ Você receberá um código de rastreamento por email</p>
                <p>✓ O prazo de entrega é de 5 a 10 dias úteis</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/account"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                Ver Meus Pedidos
              </Link>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-flex items-center justify-center gap-2"
              >
                <FiHome />
                Voltar ao Início
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <FiCheckCircle size={80} className="mx-auto text-yellow-500 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Pagamento Pendente
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Seu pagamento está sendo processado.
              </p>
              <p className="text-gray-600 text-sm">
                Você receberá uma confirmação por email quando o pagamento for aprovado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/account"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                Ver Meus Pedidos
              </Link>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-flex items-center justify-center gap-2"
              >
                <FiHome />
                Voltar ao Início
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}




