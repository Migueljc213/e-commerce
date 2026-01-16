import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, Category, User, Order } from '@/types'
import { products as initialProducts, categories as initialCategories } from '@/lib/products'

interface AdminStore {
  products: Product[]
  categories: Category[]
  users: User[]
  orders: Order[]
  // Product methods
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  // Category methods
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getCategoryById: (id: string) => Category | undefined
  getCategoryBySlug: (slug: string) => Category | undefined
  // User methods
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
  getUserById: (id: string) => User | undefined
  // Order methods
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  getOrderById: (id: string) => Order | undefined
  // Report methods
  getTopSellingProducts: (limit?: number) => Array<{ product: Product; quantity: number; revenue: number }>
  getTopSellingCategories: (limit?: number) => Array<{ category: Category; quantity: number; revenue: number }>
}

// Mock initial users
const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'user',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    role: 'user',
  },
]

// Mock initial orders for reports
const initialOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      { ...initialProducts[0], quantity: 2 },
      { ...initialProducts[4], quantity: 1 },
    ],
    total: 6599.97,
    status: 'delivered',
    createdAt: new Date('2024-01-15'),
    shippingAddress: {
      street: 'Rua Exemplo, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
    },
  },
  {
    id: '2',
    userId: '3',
    items: [
      { ...initialProducts[1], quantity: 1 },
      { ...initialProducts[2], quantity: 3 },
    ],
    total: 6999.96,
    status: 'delivered',
    createdAt: new Date('2024-01-20'),
    shippingAddress: {
      street: 'Av. Teste, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000',
      country: 'Brasil',
    },
  },
  {
    id: '3',
    userId: '2',
    items: [
      { ...initialProducts[0], quantity: 1 },
      { ...initialProducts[5], quantity: 2 },
    ],
    total: 3179.97,
    status: 'shipped',
    createdAt: new Date('2024-02-01'),
    shippingAddress: {
      street: 'Rua Exemplo, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
    },
  },
  {
    id: '4',
    userId: '3',
    items: [
      { ...initialProducts[3], quantity: 2 },
      { ...initialProducts[6], quantity: 1 },
    ],
    total: 2949.97,
    status: 'delivered',
    createdAt: new Date('2024-02-05'),
    shippingAddress: {
      street: 'Av. Teste, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000',
      country: 'Brasil',
    },
  },
]

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      categories: initialCategories.map(cat => ({
        ...cat,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      users: initialUsers,
      orders: initialOrders,
      
      // Product methods
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          rating: 0,
          reviews: 0,
        }
        set((state) => ({
          products: [...state.products, newProduct],
        }))
      },
      
      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }))
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },
      
      getProductById: (id) => {
        return get().products.find((p) => p.id === id)
      },
      
      // Category methods
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      },
      
      updateCategory: (id, categoryData) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...categoryData, updatedAt: new Date() } : c
          ),
        }))
      },
      
      deleteCategory: (id) => {
        // Don't allow deleting 'all' category
        if (id === 'all') return
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },
      
      getCategoryById: (id) => {
        return get().categories.find((c) => c.id === id)
      },
      
      getCategoryBySlug: (slug) => {
        return get().categories.find((c) => c.slug === slug)
      },
      
      // User methods
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
        }
        set((state) => ({
          users: [...state.users, newUser],
        }))
      },
      
      updateUser: (id, userData) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...userData } : u
          ),
        }))
      },
      
      deleteUser: (id) => {
        // Don't allow deleting yourself if you're the only admin
        const user = get().users.find(u => u.id === id)
        if (user?.role === 'admin') {
          const adminCount = get().users.filter(u => u.role === 'admin').length
          if (adminCount <= 1) {
            alert('Não é possível excluir o último administrador')
            return
          }
        }
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }))
      },
      
      getUserById: (id) => {
        return get().users.find((u) => u.id === id)
      },
      
      // Order methods
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          createdAt: new Date(),
        }
        set((state) => ({
          orders: [...state.orders, newOrder],
        }))
      },
      
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }))
      },
      
      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id)
      },
      
      // Report methods
      getTopSellingProducts: (limit = 10) => {
        const orders = get().orders.filter(o => o.status !== 'cancelled')
        const productMap = new Map<string, { product: Product; quantity: number; revenue: number }>()
        
        orders.forEach(order => {
          order.items.forEach(item => {
            const existing = productMap.get(item.id)
            if (existing) {
              existing.quantity += item.quantity
              existing.revenue += item.price * item.quantity
            } else {
              productMap.set(item.id, {
                product: item,
                quantity: item.quantity,
                revenue: item.price * item.quantity,
              })
            }
          })
        })
        
        return Array.from(productMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, limit)
      },
      
      getTopSellingCategories: (limit = 10) => {
        const orders = get().orders.filter(o => o.status !== 'cancelled')
        const categoryMap = new Map<string, { category: Category; quantity: number; revenue: number }>()
        const categories = get().categories
        
        orders.forEach(order => {
          order.items.forEach(item => {
            const category = categories.find(c => c.slug === item.category)
            if (!category || category.id === 'all') return
            
            const existing = categoryMap.get(category.id)
            if (existing) {
              existing.quantity += item.quantity
              existing.revenue += item.price * item.quantity
            } else {
              categoryMap.set(category.id, {
                category,
                quantity: item.quantity,
                revenue: item.price * item.quantity,
              })
            }
          })
        })
        
        return Array.from(categoryMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, limit)
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

