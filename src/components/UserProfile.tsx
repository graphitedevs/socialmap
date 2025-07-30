import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout, updateProfile, isLoading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    avatar: user?.avatar || ''
  })
  
  if (!isOpen || !user) return null
  
  const handleSave = async () => {
    await updateProfile(editForm)
    // Intentional bug: editing state doesn't always reset
    if (Math.random() > 0.3) {
      setIsEditing(false)
    }
  }
  
  const handleLogout = () => {
    logout()
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`}
              alt={user.username}
              className="w-20 h-20 rounded-full mx-auto mb-2"
              onError={(e) => {
                // Intentional bug: fallback doesn't always work
                if (Math.random() > 0.2) {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`
                }
              }}
            />
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-1 text-center border border-gray-300 rounded"
                placeholder="Username"
              />
              <input
                type="url"
                value={editForm.avatar}
                onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                className="w-full px-3 py-1 text-center border border-gray-300 rounded text-xs"
                placeholder="Avatar URL"
              />
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-gray-800">{user.username}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">
                {user.isOnline ? 'Online' : `Last seen ${user.lastSeen.toLocaleTimeString()}`}
              </p>
            </>
          )}
        </div>
        
        <div className="space-y-3">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditForm({
                    username: user.username,
                    avatar: user.avatar || ''
                  })
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              Edit Profile
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}