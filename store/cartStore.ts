import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)

        if (existingItem) {
          // Validate stock before adding
          const newQuantity = existingItem.quantity + quantity
          if (newQuantity > product.stock) {
            // Limit to available stock
            set({
              items: items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: product.stock }
                  : item
              ),
            })
          } else {
            set({
              items: items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            })
          }
        } else {
          // Validate stock for new item
          const finalQuantity = quantity > product.stock ? product.stock : quantity
          set({
            items: [...items, { ...product, quantity: finalQuantity }],
          })
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        // Validate stock
        const items = get().items
        const item = items.find((i) => i.id === productId)
        if (item && quantity > item.stock) {
          // Limit to available stock
          quantity = item.stock
        }
        
        set({
          items: items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

