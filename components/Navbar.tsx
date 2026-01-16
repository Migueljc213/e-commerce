'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiSettings } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items.length)
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            E-Commerce
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-8 hidden md:flex"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>

          {/* Mobile Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600"
          >
            <FiSearch size={20} />
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/products'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Produtos
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="p-2 text-gray-600 hover:text-primary-600 relative"
                    title="Painel Administrativo"
                  >
                    <FiSettings size={20} />
                  </Link>
                )}
                <Link
                  href="/account"
                  className="p-2 text-gray-600 hover:text-primary-600 relative"
                  title="Minha Conta"
                >
                  <FiUser size={20} />
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 text-sm text-gray-700 hover:text-primary-600"
              >
                Entrar
              </Link>
            )}

            <Link
              href="/wishlist"
              className="p-2 text-gray-600 hover:text-primary-600 relative"
            >
              <FiHeart size={20} />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-primary-600 relative"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="pb-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </form>
          </div>
        )}
      </div>
    </nav>
  )
}

