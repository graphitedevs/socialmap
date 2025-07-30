import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    id: string
    position: [number, number]
    popup: string
  }>
}

function MapResizer() {
  const map = useMap()
  
  useEffect(() => {
    // Intentional bug: sometimes the map doesn't resize properly
    const timer = setTimeout(() => {
      if (Math.random() > 0.3) { // 70% chance to work correctly
        map.invalidateSize()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [map])
  
  return null
}

export default function Map({ 
  center = [37.7749, -122.4194], // San Francisco
  zoom = 13,
  markers = []
}: MapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<any>(null)
  
  useEffect(() => {
    // Simulate loading delay with occasional long delays (bug)
    const delay = Math.random() > 0.8 ? 3000 : 500 // 20% chance of 3 sec delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleMapClick = (e: any) => {
    console.log('Map clicked at:', e.latlng)
    // Intentional bug: sometimes coordinates are NaN
    if (Math.random() > 0.9) {
      console.log('Bug triggered: invalid coordinates', { lat: NaN, lng: NaN })
    }
  }
  
  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  return (
    <div className="h-full w-full relative">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        className="h-full w-full"
        onClick={handleMapClick}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              {marker.popup}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button 
          className="block w-8 h-8 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm"
          onClick={() => {
            // Intentional bug: zoom doesn't always work
            if (mapRef.current && Math.random() > 0.1) {
              mapRef.current.setZoom(mapRef.current.getZoom() + 1)
            }
          }}
        >
          +
        </button>
        <button 
          className="block w-8 h-8 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm"
          onClick={() => {
            if (mapRef.current && Math.random() > 0.1) {
              mapRef.current.setZoom(mapRef.current.getZoom() - 1)
            }
          }}
        >
          -
        </button>
      </div>
    </div>
  )
}