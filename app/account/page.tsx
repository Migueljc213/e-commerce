'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FiUser, FiPackage, FiLogOut, FiEdit, FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Mock orders - in a real app, this would come from an API
  const orders = [
    {
      id: '1',
      date: new Date('2024-01-15'),
      total: 1299.99,
      status: 'delivered' as const,
      items: 2,
    },
    {
      id: '2',
      date: new Date('2024-01-10'),
      total: 4599.99,
      status: 'shipped' as const,
      items: 1,
    },
  ]

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Minha Conta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-primary-600" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiLogOut />
                Sair
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50"
                >
                  <FiShoppingCart />
                  Meu Carrinho
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50"
                >
                  <FiPackage />
                  Histórico de Compras
                </Link>
                <Link
                  href="/account/edit"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50"
                >
                  <FiEdit />
                  Editar Perfil
                </Link>
              </div>
            </div>
          </div>

        {/* Orders Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiPackage className="text-primary-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Pedido #{order.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.date.toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items} item{order.items !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Você ainda não fez nenhum pedido.</p>
                <Link
                  href="/products"
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Começar a Comprar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


