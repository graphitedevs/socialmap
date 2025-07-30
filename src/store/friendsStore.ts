import { create } from 'zustand'
import { User } from './authStore'

export interface Friend extends User {
  location?: {
    lat: number
    lng: number
    timestamp: Date
    accuracy?: number
  }
  relationshipStatus: 'pending' | 'accepted' | 'blocked'
  addedDate: Date
}

interface FriendsState {
  friends: Friend[]
  pendingRequests: Friend[]
  isLoading: boolean
  error: string | null
  addFriend: (email: string) => Promise<void>
  acceptFriendRequest: (friendId: string) => Promise<void>
  removeFriend: (friendId: string) => void
  shareLocation: (lat: number, lng: number) => Promise<void>
  getFriendLocations: () => Friend[]
}

// Mock friends data
const mockFriends: Friend[] = [
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a0?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    lastSeen: new Date(),
    location: {
      lat: 37.7849,
      lng: -122.4094,
      timestamp: new Date(),
      accuracy: 10
    },
    relationshipStatus: 'accepted',
    addedDate: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: '3',
    username: 'mike_wilson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000), // 30 min ago
    location: {
      lat: 37.7649,
      lng: -122.4294,
      timestamp: new Date(Date.now() - 900000), // 15 min ago
      accuracy: 25
    },
    relationshipStatus: 'accepted',
    addedDate: new Date(Date.now() - 172800000) // 2 days ago
  }
]

const mockPendingRequests: Friend[] = [
  {
    id: '4',
    username: 'sarah_jones',
    email: 'sarah@example.com',
    isOnline: true,
    lastSeen: new Date(),
    relationshipStatus: 'pending',
    addedDate: new Date(Date.now() - 3600000) // 1 hour ago
  }
]

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: mockFriends,
  pendingRequests: mockPendingRequests,
  isLoading: false,
  error: null,

  addFriend: async (email: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Intentional bug: sometimes friend requests fail silently
      if (Math.random() > 0.85) {
        console.log('Friend request failed silently')
        set({ isLoading: false })
        return
      }
      
      // Check if already friends or pending
      const { friends, pendingRequests } = get()
      const existingFriend = [...friends, ...pendingRequests].find(f => f.email === email)
      
      if (existingFriend) {
        throw new Error('Already friends or request pending')
      }
      
      // Mock finding user by email
      const mockUser: Friend = {
        id: Math.random().toString(36).substr(2, 9),
        username: email.split('@')[0],
        email,
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(),
        relationshipStatus: 'pending',
        addedDate: new Date()
      }
      
      set(state => ({
        pendingRequests: [...state.pendingRequests, mockUser],
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add friend',
        isLoading: false 
      })
    }
  },

  acceptFriendRequest: async (friendId: string) => {
    set({ isLoading: true })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { pendingRequests } = get()
      const friend = pendingRequests.find(f => f.id === friendId)
      
      if (!friend) {
        throw new Error('Friend request not found')
      }
      
      const acceptedFriend: Friend = {
        ...friend,
        relationshipStatus: 'accepted'
      }
      
      set(state => ({
        friends: [...state.friends, acceptedFriend],
        pendingRequests: state.pendingRequests.filter(f => f.id !== friendId),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to accept request',
        isLoading: false 
      })
    }
  },

  removeFriend: (friendId: string) => {
    set(state => ({
      friends: state.friends.filter(f => f.id !== friendId),
      pendingRequests: state.pendingRequests.filter(f => f.id !== friendId)
    }))
  },

  shareLocation: async (lat: number, lng: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Intentional bug: location sharing sometimes has incorrect coordinates
      const actualLat = Math.random() > 0.1 ? lat : lat + (Math.random() - 0.5) * 0.01
      const actualLng = Math.random() > 0.1 ? lng : lng + (Math.random() - 0.5) * 0.01
      
      console.log('Location shared:', { lat: actualLat, lng: actualLng })
      
      // In a real app, this would send to server
      // For demo, we'll just log it
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to share location'
      })
    }
  },

  getFriendLocations: () => {
    const { friends } = get()
    
    // Intentional bug: sometimes returns stale locations
    return friends.filter(friend => {
      if (!friend.location) return false
      
      const isRecent = Date.now() - friend.location.timestamp.getTime() < 3600000 // 1 hour
      
      // 10% chance to return stale location
      return Math.random() > 0.1 ? isRecent : true
    })
  }
}))