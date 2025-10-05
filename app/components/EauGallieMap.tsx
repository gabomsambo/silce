"use client"

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import { Icon, LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapMarker } from "@/app/data/mapMarkers"

interface EauGallieMapProps {
  markers: MapMarker[]
  center?: LatLngExpression
  zoom?: number
}

// Custom icon factory function matching design system colors
const getMarkerIcon = (type: MapMarker["type"]) => {
  // COLOR MAPPING: Match design system from tailwind.config.ts
  const iconColors = {
    property: "#D2B48C",    // tan (brand color)
    beach: "#4A90E2",       // blue
    space_center: "#E94B3C", // red
    arts: "#9B59B6",        // purple
    dining: "#F39C12"       // orange
  }

  // Use data URI for SVG to avoid external CDN dependencies
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="${iconColors[type]}" stroke="#fff" stroke-width="2"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

export default function EauGallieMap({
  markers,
  center = [28.1345, -80.6287],  // Eau Gallie center
  zoom = 12  // Zoom level showing ~10 mile radius
}: EauGallieMapProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}  // Disable scroll zoom for better UX
        className="h-full w-full"
        style={{ minHeight: "500px" }}  // Explicit height required
      >
        {/* OpenStreetMap tiles (free, no API key required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getMarkerIcon(marker.type)}
          >
            {/* Tooltip on hover */}
            <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
              <div className="font-sans">
                <strong>{marker.title}</strong>
              </div>
            </Tooltip>

            {/* Popup on click */}
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-lg mb-1">{marker.title}</h3>
                <p className="text-sm">{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
