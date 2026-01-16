import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  isAdmin: () => boolean
  initializeSeed: () => void
}

// Seed users - Admin and regular user
const seedUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Usuário Teste',
    email: 'usuario@example.com',
    password: '123456',
    role: 'user',
  },
]

// Mock users storage (in a real app, this would be a database)
let mockUsers: Array<User & { password: string }> = []

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        )
        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      register: async (name, email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Check if email already exists
        if (mockUsers.some((u) => u.email === email)) {
          return false
        }
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'user', // New users are always regular users
        }
        mockUsers.push({ ...newUser, password })
        set({
          user: newUser,
          isAuthenticated: true,
        })
        return true
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }))
      },
      isAdmin: () => {
        const state = get()
        return state.user?.role === 'admin'
      },
      initializeSeed: () => {
        // Initialize seed users - ensure seed users always exist
        seedUsers.forEach((seedUser) => {
          if (!mockUsers.some((u) => u.email === seedUser.email)) {
            mockUsers.push(seedUser)
          }
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Initialize seed users on store hydration
        if (state) {
          state.initializeSeed()
        }
      },
    }
  )
)

// Initialize seed on module load
if (typeof window !== 'undefined') {
  const store = useAuthStore.getState()
  store.initializeSeed()
}

