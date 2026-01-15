import React from 'react'
import { Home, Search, Library, Plus, Heart } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-black p-4 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <span className="text-white font-bold text-xl">Music</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-4 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Home size={24} />
          <span className="font-medium">Home</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-4 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Search size={24} />
          <span className="font-medium">Search</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-4 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Library size={24} />
          <span className="font-medium">Your Library</span>
        </a>
      </nav>

      {/* Playlist Section */}
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-4 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <div className="w-6 h-6 bg-gray-400 hover:bg-white rounded flex items-center justify-center transition-colors">
            <Plus size={16} className="text-black" />
          </div>
          <span className="font-medium">Create Playlist</span>
        </button>
        <button className="flex items-center gap-4 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-300 rounded flex items-center justify-center">
            <Heart size={14} className="text-white" />
          </div>
          <span className="font-medium">Liked Songs</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Playlists */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {['Chill Vibes', 'Workout Mix', 'Road Trip', 'Focus Time', 'Party Hits'].map(
            (playlist) => (
              <a
                key={playlist}
                href="#"
                className="px-3 py-2 text-gray-400 hover:text-white text-sm transition-colors truncate"
              >
                {playlist}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  )
}
