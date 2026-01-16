'use client'

import { useState } from 'react'
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiSearch } from 'react-icons/fi'

interface TrackingInfo {
  orderId: string
  status: string
  statusLabel: string
  estimatedDelivery: string
  trackingCode: string
  currentLocation: string
  history: Array<{
    date: string
    status: string
    location: string
  }>
}

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock tracking data
  const mockTrackingData: Record<string, TrackingInfo> = {
    '12345': {
      orderId: '12345',
      status: 'shipped',
      statusLabel: 'Enviado',
      estimatedDelivery: '2024-01-25',
      trackingCode: 'BR123456789BR',
      currentLocation: 'Centro de Distribuição - São Paulo/SP',
      history: [
        {
          date: '2024-01-20',
          status: 'Pedido confirmado',
          location: 'Loja Online',
        },
        {
          date: '2024-01-21',
          status: 'Pedido em preparação',
          location: 'Centro de Distribuição',
        },
        {
          date: '2024-01-22',
          status: 'Pedido enviado',
          location: 'Centro de Distribuição - São Paulo/SP',
        },
      ],
    },
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const info = mockTrackingData[orderId]
    setTrackingInfo(info || null)
    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="text-green-500" size={24} />
      case 'shipped':
        return <FiTruck className="text-blue-500" size={24} />
      case 'processing':
        return <FiPackage className="text-yellow-500" size={24} />
      default:
        return <FiClock className="text-gray-500" size={24} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Rastrear Pedido
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do Pedido
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Digite o número do pedido"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <FiSearch />
              {isLoading ? 'Buscando...' : 'Rastrear'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Exemplo: 12345
          </p>
        </form>

        {/* Tracking Info */}
        {trackingInfo ? (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pedido #{trackingInfo.orderId}
                </h2>
                <p className="text-gray-600">
                  Código de rastreamento: {trackingInfo.trackingCode}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                  trackingInfo.status
                )}`}
              >
                {trackingInfo.statusLabel}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon(trackingInfo.status)}
              <div>
                <p className="font-semibold text-gray-900">
                  {trackingInfo.currentLocation}
                </p>
                <p className="text-sm text-gray-600">
                  Previsão de entrega: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Histórico do Pedido
              </h3>
              <div className="space-y-4">
                {trackingInfo.history.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {event.status}
                      </p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : orderId && !isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">
              Pedido não encontrado. Verifique o número do pedido e tente novamente.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}




