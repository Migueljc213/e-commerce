'use client'

import { useAdminStore } from '@/store/adminStore'
import { FiPackage, FiTag, FiTrendingUp, FiDollarSign } from 'react-icons/fi'
import Link from 'next/link'

export default function AdminDashboard() {
  const { products, categories } = useAdminStore()

  const totalProducts = products.length
  const totalCategories = categories.filter(c => c.id !== 'all').length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const lowStockProducts = products.filter(p => p.stock < 10).length

  const stats = [
    {
      title: 'Total de Produtos',
      value: totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      title: 'Categorias',
      value: totalCategories,
      icon: FiTag,
      color: 'bg-green-500',
      href: '/admin/categories',
    },
    {
      title: 'Valor Total em Estoque',
      value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Produtos com Estoque Baixo',
      value: lowStockProducts,
      icon: FiTrendingUp,
      color: 'bg-red-500',
      href: '/admin/products?filter=lowStock',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const content = (
            <div className={`${stat.color} p-6 rounded-lg text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Icon size={32} />
                {stat.href && (
                  <Link
                    href={stat.href}
                    className="text-white hover:text-gray-200 text-sm underline"
                  >
                    Ver mais
                  </Link>
                )}
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )

          return stat.href ? (
            <Link key={index} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          )
        })}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Produtos Recentes</h2>
          <Link
            href="/admin/products"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Produto</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Categoria</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Preço</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        product.stock < 10
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



