'use client'

import { useAdminStore } from '@/store/adminStore'
import { FiTrendingUp, FiPackage, FiTag, FiDollarSign } from 'react-icons/fi'

export default function AdminReportsPage() {
  const { 
    orders, 
    getTopSellingProducts, 
    getTopSellingCategories,
    products,
    categories 
  } = useAdminStore()

  const topProducts = getTopSellingProducts(10)
  const topCategories = getTopSellingCategories(10)
  
  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === 'delivered').length
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

  const stats = [
    {
      title: 'Total de Pedidos',
      value: totalOrders,
      icon: FiPackage,
      color: 'bg-blue-500',
    },
    {
      title: 'Pedidos Concluídos',
      value: completedOrders,
      icon: FiTrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Relatórios de Vendas</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`${stat.color} p-6 rounded-lg text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Icon size={32} />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiPackage size={24} className="text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Produtos Mais Vendidos</h2>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                      {index + 1}
                    </div>
                  </div>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} unidade{item.quantity !== 1 ? 's' : ''} vendida{item.quantity !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">Receita</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma venda registrada ainda
            </div>
          )}
        </div>

        {/* Top Selling Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiTag size={24} className="text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Categorias Mais Vendidas</h2>
          </div>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((item, index) => (
                <div
                  key={item.category.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.category.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} unidade{item.quantity !== 1 ? 's' : ''} vendida{item.quantity !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">Receita</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma venda registrada ainda
            </div>
          )}
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo de Vendas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Pedidos Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Em Processamento</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Enviados</p>
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



