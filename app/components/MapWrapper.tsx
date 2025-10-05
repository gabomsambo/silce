"use client"

import dynamic from "next/dynamic"
import { MapMarker } from "@/app/data/mapMarkers"
import { LatLngExpression } from "leaflet"

interface MapWrapperProps {
  markers: MapMarker[]
  center?: LatLngExpression
  zoom?: number
}

// CRITICAL: ssr: false prevents "window is not defined" error with Leaflet
const EauGallieMap = dynamic(() => import("./EauGallieMap"), {
  loading: () => (
    // Loading skeleton matching MagicCard style
    <div className="h-full w-full min-h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan mx-auto mb-4"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  ),
  ssr: false  // CRITICAL: Disable SSR for Leaflet
})

export default function MapWrapper(props: MapWrapperProps) {
  return <EauGallieMap {...props} />
}
