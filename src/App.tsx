import React, { useState } from 'react'
import Map from './components/Map'

function App() {
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
  
  return (
    <div className="h-screen w-full flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Social Maps
        </h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Sign In
          </button>
        </div>
      </header>
      
      <main className="flex-1">
        <Map 
          center={[37.7749, -122.4194]}
          zoom={13}
          markers={sampleMarkers}
        />
      </main>
    </div>
  )
}

export default App