'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiClock, FiHome, FiPackage } from 'react-icons/fi'

export default function PaymentPendingPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <FiClock size={80} className="mx-auto text-yellow-500 mb-4" />
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiPackage className="text-primary-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Informações Importantes
            </h2>
          </div>
          <div className="text-left space-y-3 text-gray-600">
            <p>• O pagamento pode levar alguns minutos para ser processado</p>
            <p>• Você receberá um email de confirmação assim que o pagamento for aprovado</p>
            <p>• Seu pedido será processado automaticamente após a confirmação do pagamento</p>
            <p>• Em caso de dúvidas, entre em contato com nosso suporte</p>
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
      </div>
    </div>
  )
}




