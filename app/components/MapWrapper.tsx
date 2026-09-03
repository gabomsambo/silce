"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { MapMarker } from "@/app/data/mapMarkers"
import { LatLngExpression } from "leaflet"

interface MapWrapperProps {
  markers: MapMarker[]
  center?: LatLngExpression
  zoom?: number
}

// Loading skeleton matching MagicCard style
function MapLoading() {
  const t = useTranslations("map")

  return (
    <div className="h-full w-full min-h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan-ink mx-auto mb-4"></div>
        <p className="text-gray-600">{t("loading")}</p>
      </div>
    </div>
  )
}

// CRITICAL: ssr: false prevents "window is not defined" error with Leaflet
const EauGallieMap = dynamic(() => import("./EauGallieMap"), {
  loading: () => <MapLoading />,
  ssr: false  // CRITICAL: Disable SSR for Leaflet
})

export default function MapWrapper(props: MapWrapperProps) {
  return <EauGallieMap {...props} />
}
