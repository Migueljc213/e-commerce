'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { Address } from '@/types'
import { FiLock, FiTruck, FiCheck, FiCreditCard } from 'react-icons/fi'
import { useCouponStore } from '@/store/couponStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const { isAuthenticated, user } = useAuthStore()
  const { activeCoupon, calculateDiscount } = useCouponStore()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Brasil',
    paymentMethod: 'mercadopago',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = getTotalPrice()
  const discount = calculateDiscount(subtotal)
  const shipping = 15.0
  const finalTotal = subtotal - discount + shipping

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.street.trim()) newErrors.street = 'Endereço é obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Criar preferência de pagamento no Mercado Pago
      const response = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          discount: discount,
          userId: user?.id,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          user: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      // Obter URL de checkout (pode ser simulação ou MercadoPago real)
      const checkoutUrl = process.env.NODE_ENV === 'production' 
        ? data.init_point 
        : data.sandbox_init_point || data.init_point

      if (checkoutUrl) {
        // Salvar dados do pedido temporariamente
        const orderData = {
          items,
          total: finalTotal,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          preferenceId: data.id,
        }
        sessionStorage.setItem('pendingOrder', JSON.stringify(orderData))
        
        // Redirecionar para página de pagamento (simulação ou MercadoPago real)
        window.location.href = checkoutUrl
      } else {
        throw new Error('URL de checkout não disponível')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setErrors({ submit: error.message || 'Erro ao processar pagamento. Tente novamente.' })
      setIsProcessing(false)
    }
  }

  const content = items.length === 0 ? (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
      <button
        onClick={() => router.push('/products')}
        className="text-primary-600 hover:underline"
      >
        Voltar para produtos
      </button>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Finalizar Compra</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiTruck className="text-primary-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Informações de Entrega
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="00000-000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiCreditCard className="text-primary-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Método de Pagamento
              </h2>
            </div>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <FiCreditCard className="text-primary-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mercado Pago</h3>
                  <p className="text-gray-600">Pagamento seguro e rápido</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>✓ Aceita cartões de crédito e débito</p>
                <p>✓ PIX e boleto bancário</p>
                <p>✓ Parcelamento em até 12x</p>
                <p>✓ Ambiente 100% seguro</p>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Você será redirecionado para o checkout seguro do Mercado Pago para finalizar o pagamento.
              </p>
            </div>
            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Resumo do Pedido</h2>
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
                  <span>Desconto {activeCoupon?.code && `(${activeCoupon.code})`}</span>
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
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                <>
                  <FiLock />
                  Ir para Pagamento
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              <FiCheck className="inline mr-1" />
              Compra 100% segura
            </p>
          </div>
        </div>
      </form>
    </div>
  )

  return (
    <ProtectedRoute>
      {content}
    </ProtectedRoute>
  )
}
