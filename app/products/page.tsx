'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getProducts, getProductsByCategory, searchProducts, categories } from '@/lib/products'
import { Product } from '@/types'

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''

    setSelectedCategory(category)
    setSearchQuery(search)

    let filteredProducts: Product[]
    if (search) {
      filteredProducts = searchProducts(search)
    } else {
      filteredProducts = getProductsByCategory(category)
    }
    setProducts(filteredProducts)
  }, [searchParams])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const newUrl = category === 'all' 
      ? '/products' 
      : `/products?category=${category}`
    router.push(newUrl)
    setProducts(getProductsByCategory(category))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Produtos</h1>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-600">
        {searchQuery ? (
          <p>
            {products.length} resultado{products.length !== 1 ? 's' : ''} para
            &quot;{searchQuery}&quot;
          </p>
        ) : (
          <p>
            {products.length} produto{products.length !== 1 ? 's' : ''}{' '}
            encontrado{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">
            Nenhum produto encontrado.
          </p>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}

