'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { 
  FiHome, 
  FiPackage, 
  FiTag, 
  FiBarChart2, 
  FiUsers,
  FiLogOut 
} from 'react-icons/fi'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { logout, isAdmin } = useAuthStore()
  const router = useRouter()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: FiHome },
    { href: '/admin/products', label: 'Produtos', icon: FiPackage },
    { href: '/admin/categories', label: 'Categorias', icon: FiTag },
    { href: '/admin/users', label: 'Usuários', icon: FiUsers },
    { href: '/admin/reports', label: 'Relatórios', icon: FiBarChart2 },
  ]

  return (
    <ProtectedRoute requireAdmin redirectTo="/account">
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-primary-600">Admin Panel</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={() => {
                logout()
                router.push('/')
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
            >
              <FiLogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

