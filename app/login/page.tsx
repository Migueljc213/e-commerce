'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(formData.email, formData.password)

    if (success) {
      // Redirect based on user role
      const currentUser = useAuthStore.getState().user
      if (currentUser?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/account')
      }
    } else {
      setError('Email ou senha incorretos')
    }

    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Entrar</h1>
          <p className="text-gray-600">
            Acesse sua conta para continuar comprando
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <FiLogIn />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Contas de teste:</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-700">Admin:</p>
                <p className="text-sm text-gray-600">Email: admin@example.com</p>
                <p className="text-sm text-gray-600">Senha: admin123</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">Usuário:</p>
                <p className="text-sm text-gray-600">Email: usuario@example.com</p>
                <p className="text-sm text-gray-600">Senha: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


