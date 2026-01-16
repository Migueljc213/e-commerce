'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiXCircle, FiHome, FiShoppingBag } from 'react-icons/fi'

export default function PaymentFailurePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <FiXCircle size={80} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pagamento Não Aprovado
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Não foi possível processar seu pagamento.
          </p>
          <p className="text-gray-600 text-sm">
            Por favor, verifique os dados do seu cartão ou tente outro método de pagamento.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            O que fazer agora?
          </h2>
          <div className="text-left space-y-3 text-gray-600">
            <p>• Verifique se os dados do cartão estão corretos</p>
            <p>• Confirme se há saldo disponível</p>
            <p>• Tente usar outro método de pagamento (PIX, boleto)</p>
            <p>• Entre em contato com seu banco se o problema persistir</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/checkout')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            <FiShoppingBag />
            Tentar Novamente
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-flex items-center justify-center gap-2"
          >
            <FiHome />
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  )
}




