'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FiStar, FiArrowLeft, FiUser } from 'react-icons/fi'
import { getProductById } from '@/lib/products'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

export default function ReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProductById(params.id as string)
  const { isAuthenticated, user } = useAuthStore()
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Maria Silva',
      rating: 5,
      comment: 'Produto excelente! Superou minhas expectativas. Recomendo!',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      userId: '2',
      userName: 'João Santos',
      rating: 4,
      comment: 'Bom produto, entrega rápida. Poderia ter mais opções de cor.',
      createdAt: new Date('2024-01-08'),
    },
  ])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  })
  const [showForm, setShowForm] = useState(false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <Link href="/products" className="text-primary-600 hover:underline">
          Voltar para produtos
        </Link>
      </div>
    )
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date(),
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 5, comment: '' })
    setShowForm(false)
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft />
        Voltar
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Avaliações - {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`${
                    star <= averageRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-600">
            ({reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''})
          </span>
        </div>
      </div>

      {isAuthenticated && (
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Escrever Avaliação
            </button>
          ) : (
            <form
              onSubmit={handleSubmitReview}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Sua Avaliação
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`${
                          star <= newReview.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                        size={32}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Enviar Avaliação
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setNewReview({ rating: 5, comment: '' })
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.userName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {review.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`${
                        star <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Ainda não há avaliações para este produto.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}




