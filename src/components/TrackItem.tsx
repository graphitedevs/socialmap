import React from 'react'
import { Play, Pause } from 'lucide-react'
import { Track, useMusicStore } from '../store/musicStore'

interface TrackItemProps {
  track: Track
  index: number
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function TrackItem({ track, index }: TrackItemProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = useMusicStore()
  const isCurrentTrack = currentTrack?.id === track.id

  const handleClick = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
        ${isCurrentTrack ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}
    >
      {/* Track Number / Play Button */}
      <div className="w-8 text-center">
        {isCurrentTrack && isPlaying ? (
          <div className="flex items-center justify-center gap-0.5">
            <span className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" />
            <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-5 bg-purple-400 rounded-full animate-pulse delay-150" />
          </div>
        ) : (
          <>
            <span className="text-gray-400 group-hover:hidden">
              {index + 1}
            </span>
            <Play
              size={16}
              className="text-white hidden group-hover:block mx-auto"
            />
          </>
        )}
      </div>

      {/* Cover Art */}
      <img
        src={track.coverUrl}
        alt={track.album}
        className="w-12 h-12 rounded shadow-md"
      />

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${isCurrentTrack ? 'text-purple-400' : 'text-white'}`}>
          {track.title}
        </h3>
        <p className="text-gray-400 text-sm truncate">{track.artist}</p>
      </div>

      {/* Album */}
      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-gray-400 text-sm truncate">{track.album}</p>
      </div>

      {/* Duration */}
      <div className="text-gray-400 text-sm">
        {formatDuration(track.duration)}
      </div>
    </div>
  )
}
