import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  audioUrl: string
}

interface MusicState {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'

  setTracks: (tracks: Track[]) => void
  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  playNext: () => void
  playPrevious: () => void
}

const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Wave',
    album: 'Nocturnal Vibes',
    duration: 234,
    coverUrl: 'https://picsum.photos/seed/album1/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Electric Sunset',
    artist: 'Neon Pulse',
    album: 'City Lights',
    duration: 198,
    coverUrl: 'https://picsum.photos/seed/album2/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Ocean Breeze',
    artist: 'Coastal Dreams',
    album: 'Summer Tales',
    duration: 267,
    coverUrl: 'https://picsum.photos/seed/album3/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Mountain High',
    artist: 'Summit Sound',
    album: 'Peak Experience',
    duration: 312,
    coverUrl: 'https://picsum.photos/seed/album4/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Urban Rhythm',
    artist: 'Street Beat',
    album: 'Downtown Sessions',
    duration: 245,
    coverUrl: 'https://picsum.photos/seed/album5/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '6',
    title: 'Starlight Serenade',
    artist: 'Cosmic Harmony',
    album: 'Galaxy Grooves',
    duration: 289,
    coverUrl: 'https://picsum.photos/seed/album6/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: '7',
    title: 'Forest Walk',
    artist: 'Nature Sounds',
    album: 'Earthly Tones',
    duration: 356,
    coverUrl: 'https://picsum.photos/seed/album7/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: '8',
    title: 'Rainy Day Jazz',
    artist: 'Blue Note Trio',
    album: 'Café Sessions',
    duration: 278,
    coverUrl: 'https://picsum.photos/seed/album8/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  }
]

export const useMusicStore = create<MusicState>((set, get) => ({
  tracks: sampleTracks,
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',

  setTracks: (tracks) => set({ tracks }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleRepeat: () => set((state) => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(state.repeat)
    return { repeat: modes[(currentIndex + 1) % modes.length] }
  }),

  playNext: () => {
    const { tracks, currentTrack, shuffle } = get()
    if (!currentTrack || tracks.length === 0) return

    let nextIndex: number
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length)
    } else {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
      nextIndex = (currentIndex + 1) % tracks.length
    }
    set({ currentTrack: tracks[nextIndex] })
  },

  playPrevious: () => {
    const { tracks, currentTrack, shuffle } = get()
    if (!currentTrack || tracks.length === 0) return

    let prevIndex: number
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * tracks.length)
    } else {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
      prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
    }
    set({ currentTrack: tracks[prevIndex] })
  }
}))
