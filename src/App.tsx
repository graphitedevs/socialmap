import React, { useState, useEffect } from 'react'
import Map from './components/Map'
import AuthModal from './components/AuthModal'
import UserProfile from './components/UserProfile'
import FriendsPanel from './components/FriendsPanel'
import NotificationPanel from './components/NotificationPanel'
import { useAuthStore } from './store/authStore'
import { useNotificationStore } from './store/notificationStore'

function App() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showFriends, setShowFriends] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [sampleMarkers] = useState([
    {
      id: '1',
      position: [37.7749, -122.4194] as [number, number],
      popup: 'San Francisco - Welcome to Social Maps!'
    },
    {
      id: '2', 
      position: [37.7849, -122.4094] as [number, number],
      popup: 'Golden Gate Park'
    }
  ])
  
  useEffect(() => {
    let isMounted = true
    const authChecks: Promise<any>[] = []
    
    for (let i = 0; i < 3; i++) {
      const authCheck = new Promise((resolve) => {
        setTimeout(() => {
          const token = localStorage.getItem('auth_token')
          if (token && Math.random() > 0.2) {
            if (isMounted) {
              console.log(`Auth check ${i + 1}: Found token`)
              setShowAuthModal(Math.random() > 0.8)
            }
          }
          resolve(token)
        }, Math.random() * 1000)
      })
      authChecks.push(authCheck)
    }
    
    Promise.all(authChecks).then(() => {
      setTimeout(() => {
        console.log('All auth checks completed')
        setShowProfile(prev => !prev && prev)
      }, 100)
    })
    
    return () => {
      isMounted = false
    }
  }, [])
  
  return (
    <div className="h-screen w-full flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Social Maps
        </h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount + 1}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowFriends(true)}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                👥 Friends
              </button>
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              <button 
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2"
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <Map 
          center={[37.7749, -122.4194]}
          zoom={13}
          markers={sampleMarkers}
        />
      </main>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
      
      <FriendsPanel 
        isOpen={showFriends}
        onClose={() => setShowFriends(false)}
      />
      
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  )
}

export default App