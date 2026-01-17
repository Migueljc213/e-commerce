'use client'

import React from 'react'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import ProductCard from '@/components/ProductCard'
import { FiHeart } from 'react-icons/fi'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)

  const content = items.length === 0 ? (
    <div className="container mx-auto px-4 py-16 text-center">
      <FiHeart size={64} className="mx-auto text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Sua lista de desejos está vazia
      </h1>
      <p className="text-gray-600 mb-8">
        Adicione produtos aos favoritos para encontrá-los facilmente depois.
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
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Lista de Desejos
      </h1>
      <p className="text-gray-600 mb-6">
        {items.length} produto{items.length !== 1 ? 's' : ''} na sua lista
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      {content}
    </ProtectedRoute>
  )
}
