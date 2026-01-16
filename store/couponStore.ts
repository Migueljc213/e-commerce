import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Coupon {
  code: string
  discount: number // porcentagem
  type: 'percentage' | 'fixed'
  minPurchase?: number
  expiresAt?: Date
}

interface CouponStore {
  activeCoupon: Coupon | null
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
  calculateDiscount: (total: number) => number
}

// Cupons disponíveis (em produção, viriam de um banco de dados)
const availableCoupons: Coupon[] = [
  {
    code: 'BEMVINDO10',
    discount: 10,
    type: 'percentage',
    minPurchase: 100,
  },
  {
    code: 'FRETE15',
    discount: 15,
    type: 'fixed',
    minPurchase: 200,
  },
  {
    code: 'DESCONTO20',
    discount: 20,
    type: 'percentage',
    minPurchase: 300,
  },
]

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      activeCoupon: null,
      applyCoupon: (code) => {
        const coupon = availableCoupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        )

        if (!coupon) {
          return { success: false, message: 'Cupom inválido' }
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return { success: false, message: 'Cupom expirado' }
        }

        set({ activeCoupon: coupon })
        return { success: true, message: 'Cupom aplicado com sucesso!' }
      },
      removeCoupon: () => {
        set({ activeCoupon: null })
      },
      calculateDiscount: (total) => {
        const coupon = get().activeCoupon
        if (!coupon) return 0

        if (coupon.minPurchase && total < coupon.minPurchase) {
          return 0
        }

        if (coupon.type === 'percentage') {
          return (total * coupon.discount) / 100
        } else {
          return coupon.discount
        }
      },
    }),
    {
      name: 'coupon-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)




