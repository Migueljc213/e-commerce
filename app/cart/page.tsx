'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useCouponStore } from '@/store/couponStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  
  const { activeCoupon, applyCoupon, removeCoupon, calculateDiscount } = useCouponStore()
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')

  const subtotal = getTotalPrice()
  const discount = calculateDiscount(subtotal)
  const shipping = subtotal > 0 ? 15.0 : 0
  const finalTotal = subtotal - discount + shipping

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode)
    setCouponMessage(result.message)
    if (result.success) {
      setCouponCode('')
    }
  }

  return (
    <ProtectedRoute>
      {items.length === 0 ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <FiShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Seu carrinho está vazio
          </h1>
          <p className="text-gray-600 mb-8">
            Adicione produtos ao carrinho para continuar comprando.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
            >
              <Link href={`/products/${item.id}`} className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </Link>
              <div className="flex-1">
                <Link href={`/products/${item.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-primary-600 font-bold text-xl mb-4">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Limpar carrinho
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Resumo do Pedido
            </h2>
            
            {/* Coupon Section */}
            <div className="mb-6">
              {activeCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FiTag className="text-green-600" />
                      <span className="font-semibold text-green-800">
                        {activeCoupon.code}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                  <p className="text-sm text-green-700">
                    Desconto de{' '}
                    {activeCoupon.type === 'percentage'
                      ? `${activeCoupon.discount}%`
                      : `R$ ${activeCoupon.discount.toFixed(2)}`}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cupom de Desconto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value)
                        setCouponMessage('')
                      }}
                      placeholder="Código do cupom"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-sm mt-2 ${
                        couponMessage.includes('sucesso')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {couponMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
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
              <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Finalizar Compra
            </button>
            <Link
              href="/products"
              className="block text-center mt-4 text-primary-600 hover:text-primary-700"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
      )}
    </ProtectedRoute>
  )
}

