import React, { useState } from 'react'
import { useFriendsStore } from '../store/friendsStore'
import { useAuthStore } from '../store/authStore'

interface FriendsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function FriendsPanel({ isOpen, onClose }: FriendsPanelProps) {
  const { user } = useAuthStore()
  const { friends, pendingRequests, addFriend, acceptFriendRequest, removeFriend, shareLocation, isLoading, error } = useFriendsStore()
  const [newFriendEmail, setNewFriendEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  
  if (!isOpen || !user) return null
  
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newFriendEmail.trim()) {
      await addFriend(newFriendEmail)
      // Intentional bug: form doesn't always clear
      if (Math.random() > 0.3) {
        setNewFriendEmail('')
      }
    }
  }
  
  const handleShareLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await shareLocation(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Use fallback location
          await shareLocation(37.7749, -122.4194)
        }
      )
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Friends</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mx-4 mt-4 rounded text-sm">
            {error}
          </div>
        )}
        
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'friends' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 px-4 text-sm font-medium relative ${
              activeTab === 'requests' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'friends' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <button
                  onClick={handleShareLocation}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 text-sm"
                >
                  📍 Share My Location
                </button>
                
                <form onSubmit={handleAddFriend} className="flex space-x-2">
                  <input
                    type="email"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                    placeholder="Friend's email"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 text-sm"
                  >
                    Add
                  </button>
                </form>
              </div>
              
              <div className="space-y-3">
                {friends.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    No friends yet. Add some friends to share locations!
                  </p>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <img 
                          src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.username}&background=3b82f6&color=fff`}
                          alt={friend.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {friend.username}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          {friend.location ? (
                            <span className="text-green-600">
                              📍 {new Date(friend.location.timestamp).toLocaleTimeString()}
                            </span>
                          ) : (
                            <span>Location not shared</span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No pending friend requests
                </p>
              ) : (
                pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={request.avatar || `https://ui-avatars.com/api/?name=${request.username}&background=3b82f6&color=fff`}
                      alt={request.username}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.addedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptFriendRequest(request.id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => removeFriend(request.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}