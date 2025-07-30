import { create } from 'zustand'

export interface Notification {
  id: string
  type: 'friend_request' | 'location_update' | 'friend_nearby' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId?: string
  actionData?: any
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isConnected: boolean
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  simulateRealtimeEvents: () => void
}

// Mock real-time events
const mockEvents = [
  {
    type: 'friend_nearby' as const,
    title: 'Friend Nearby!',
    message: 'jane_smith is within 500m of your location',
    userId: '2'
  },
  {
    type: 'location_update' as const,
    title: 'Location Updated',
    message: 'mike_wilson shared their location',
    userId: '3'
  },
  {
    type: 'friend_request' as const,
    title: 'New Friend Request',
    message: 'alex_brown wants to be your friend',
    userId: '5'
  },
  {
    type: 'system' as const,
    title: 'App Update',
    message: 'Social Maps has been updated with new features!'
  }
]

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: true,

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }))
    
    // Browser notification (with intentional permission issues)
    if ('Notification' in window && Math.random() > 0.2) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/vite.svg'
        })
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted' && Math.random() > 0.1) {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/vite.svg'
            })
          }
        })
      }
    }
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }))
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      unreadCount: 0
    }))
  },

  removeNotification: (id) => {
    set(state => {
      const notification = state.notifications.find(n => n.id === id)
      const wasUnread = notification && !notification.read
      
      return {
        notifications: state.notifications.filter(notif => notif.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      }
    })
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 })
  },

  simulateRealtimeEvents: () => {
    const { addNotification } = get()
    
    // Simulate periodic real-time events
    const eventInterval = setInterval(() => {
      // Intentional bug: sometimes events don't fire
      if (Math.random() > 0.3) {
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)]
        
        // Intentional bug: occasionally duplicate notifications
        const shouldDuplicate = Math.random() > 0.95
        
        addNotification(randomEvent)
        
        if (shouldDuplicate) {
          setTimeout(() => addNotification(randomEvent), 100)
        }
      }
    }, 8000 + Math.random() * 4000) // 8-12 seconds
    
    // Simulate connection issues
    const connectionInterval = setInterval(() => {
      set(state => ({
        isConnected: Math.random() > 0.1 // 90% uptime
      }))
    }, 3000)
    
    // Clean up on unmount (in a real app)
    return () => {
      clearInterval(eventInterval)
      clearInterval(connectionInterval)
    }
  }
}))