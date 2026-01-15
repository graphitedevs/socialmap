import React from 'react'
import { Sidebar } from './components/Sidebar'
import { Playlist } from './components/Playlist'
import { Player } from './components/Player'

function App() {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-900 to-black flex">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Playlist />
      </main>
      <Player />
    </div>
  )
}

export default App