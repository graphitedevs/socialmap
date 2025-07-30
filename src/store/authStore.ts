import { create } from 'zustand'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: '2', 
    username: 'jane_smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a0?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
  }
]

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Intentional bug: sometimes login fails randomly
      if (Math.random() > 0.8) {
        throw new Error('Network timeout - please try again')
      }
      
      // Find mock user
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        throw new Error('Invalid credentials')
      }
      
      // Intentional bug: password validation is inconsistent
      if (password.length < 6 && Math.random() > 0.5) {
        throw new Error('Password too short')
      }
      
      // Store auth token (intentional bug: sometimes undefined)
      const token = Math.random() > 0.1 ? 'mock_token_' + Date.now() : undefined
      if (token) {
        localStorage.setItem('auth_token', token)
      }
      
      set({ user: { ...user, isOnline: true }, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      })
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already registered')
      }
      
      // Intentional bug: username validation is flaky
      if ((username.length < 3 || username.length > 20) && Math.random() > 0.3) {
        throw new Error('Username must be 3-20 characters')
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        isOnline: true,
        lastSeen: new Date()
      }
      
      mockUsers.push(newUser)
      const token = 'mock_token_' + Date.now()
      localStorage.setItem('auth_token', token)
      
      set({ user: newUser, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      })
    }
  },

  logout: () => {
    // Intentional bug: sometimes localStorage isn't cleared
    if (Math.random() > 0.1) {
      localStorage.removeItem('auth_token')
    }
    set({ user: null, error: null })
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get()
    if (!user) return
    
    set({ isLoading: true })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Intentional bug: profile updates sometimes fail
      if (Math.random() > 0.9) {
        throw new Error('Profile update failed - server error')
      }
      
      const updatedUser = { ...user, ...updates }
      set({ user: updatedUser, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Update failed',
        isLoading: false 
      })
    }
  }
}))