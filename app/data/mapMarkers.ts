// app/data/mapMarkers.ts - Centralized marker data
import { LatLngExpression } from "leaflet"

export type MarkerType = "property" | "beach" | "space_center" | "arts" | "dining"

export interface MapMarker {
  id: string
  position: LatLngExpression  // [lat, lng] tuple
  title: string
  description: string
  type: MarkerType
}

// Real coordinates for Eau Gallie area
export const EAU_GALLIE_CENTER: LatLngExpression = [28.1345, -80.6287]

export const MAP_MARKERS: MapMarker[] = [
  {
    id: "staylokal-main",
    position: [28.1345, -80.6287],  // Eau Gallie main area
    title: "Silver Pineapple Properties",
    description: "Luxury vacation rentals in the heart of Eau Gallie Arts District",
    type: "property"
  },
  {
    id: "paradise-beach",
    position: [28.1167, -80.6044],  // Melbourne Beach
    title: "Melbourne Beach",
    description: "10-15 minute drive to pristine Atlantic beaches",
    type: "beach"
  },
  {
    id: "kennedy-space",
    position: [28.5729, -80.6490],  // Kennedy Space Center
    title: "Kennedy Space Center",
    description: "50-minute drive to NASA's launch headquarters",
    type: "space_center"
  },
  {
    id: "eau-gallie-arts",
    position: [28.1289, -80.6249],  // Arts district
    title: "Eau Gallie Arts District",
    description: "30+ murals, 50+ galleries, craft breweries",
    type: "arts"
  },
  {
    id: "intracoastal-brewing",
    position: [28.1312, -80.6275],  // Dining example
    title: "Intracoastal Brewing Co.",
    description: "Local craft brewery and dining",
    type: "dining"
  }
]
