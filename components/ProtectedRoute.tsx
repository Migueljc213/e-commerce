'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

type ProtectedRouteProps = {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push(redirectTo || '/login')
      return
    }

    if (requireAdmin && !isAdmin()) {
      router.push(redirectTo || '/account')
      return
    }
  }, [isAuthenticated, user, requireAdmin, router, redirectTo])

  if (!isAuthenticated || !user) {
    return null
  }

  if (requireAdmin && !isAdmin()) {
    return null
  }

  return <>{children}</>
}

export { ProtectedRoute }
export default ProtectedRoute
