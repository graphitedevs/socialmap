import React, { useEffect } from 'react'
import { useNotificationStore } from '../store/notificationStore'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { 
    notifications, 
    unreadCount, 
    isConnected,
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll,
    simulateRealtimeEvents
  } = useNotificationStore()
  
  useEffect(() => {
    // Start simulating real-time events when component mounts
    const cleanup = simulateRealtimeEvents()
    return cleanup
  }, [simulateRealtimeEvents])
  
  if (!isOpen) return null
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request': return '👤'
      case 'location_update': return '📍'
      case 'friend_nearby': return '🔔'
      case 'system': return '⚙️'
      default: return '📢'
    }
  }
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'friend_request': return 'border-l-blue-500'
      case 'location_update': return 'border-l-green-500'
      case 'friend_nearby': return 'border-l-orange-500'
      case 'system': return 'border-l-purple-500'
      default: return 'border-l-gray-500'
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        {!isConnected && (
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-2 text-sm">
            Connection issues detected. Some notifications may be delayed.
          </div>
        )}
        
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <span className="text-sm text-gray-600">
            {notifications.length} total notifications
          </span>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">🔔</p>
              <p>No notifications yet</p>
              <p className="text-sm mt-1">You'll see updates here when friends share locations or send requests</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium text-gray-900 ${
                          !notification.read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Real-time notifications {isConnected ? 'active' : 'disconnected'}
          </p>
        </div>
      </div>
    </div>
  )
}