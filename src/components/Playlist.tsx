import React from 'react'
import { Music, Clock } from 'lucide-react'
import { useMusicStore } from '../store/musicStore'
import { TrackItem } from './TrackItem'

export function Playlist() {
  const { tracks } = useMusicStore()

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-b from-purple-900/40 to-transparent">
        <div className="flex items-end gap-6">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center">
            <Music size={64} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-300 uppercase font-medium">Playlist</p>
            <h1 className="text-5xl font-bold text-white mt-2 mb-4">My Music</h1>
            <p className="text-gray-300">{tracks.length} tracks</p>
          </div>
        </div>
      </div>

      {/* Track List Header */}
      <div className="px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
          <div className="w-8 text-center">#</div>
          <div className="w-12" /> {/* Cover art space */}
          <div className="flex-1">Title</div>
          <div className="hidden md:block flex-1">Album</div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto px-3 pb-32">
        {tracks.map((track, index) => (
          <TrackItem key={track.id} track={track} index={index} />
        ))}
      </div>
    </div>
  )
}
