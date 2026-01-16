'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { FiShoppingCart, FiStar, FiArrowLeft, FiMinus, FiPlus, FiMessageSquare } from 'react-icons/fi'
import { getProductById } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProductById(params.id as string)
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <Link
          href="/products"
          className="text-primary-600 hover:underline"
        >
          Voltar para produtos
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product, quantity)
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 300)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-96 lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-semibold">{product.rating}</span>
            </div>
            <span className="text-gray-600">
              ({product.reviews} avaliações)
            </span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-primary-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Estoque: {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
            </p>
            <p className="text-sm text-gray-600">
              Categoria: <span className="capitalize">{product.category}</span>
            </p>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <FiShoppingCart />
            {isAdding ? 'Adicionado!' : product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
          </button>

          {/* Reviews Link */}
          <Link
            href={`/products/${product.id}/reviews`}
            className="w-full mt-4 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FiMessageSquare />
            Ver Avaliações ({product.reviews})
          </Link>
        </div>
      </div>
    </div>
  )
}

