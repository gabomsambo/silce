// app/data/mapMarkers.ts - Centralized marker data
import { LatLngExpression } from "leaflet"

export type MarkerType = "property" | "beach" | "space_center" | "arts" | "dining"

/**
 * Marker copy lives in `messages/{locale}.json` under `map.markers.<id>`;
 * this module holds only coordinates, ids and types.
 */
export interface MapMarker {
  id: string
  position: LatLngExpression  // [lat, lng] tuple
  titleKey: string
  descriptionKey: string
  type: MarkerType
}

// Real coordinates for Eau Gallie area
export const EAU_GALLIE_CENTER: LatLngExpression = [28.1345, -80.6287]

export const MAP_MARKERS: MapMarker[] = [
  {
    id: "staylokal-main",
    position: [28.1345, -80.6287],  // Eau Gallie main area
    titleKey: "map.markers.staylokal-main.title",
    descriptionKey: "map.markers.staylokal-main.description",
    type: "property"
  },
  {
    id: "paradise-beach",
    position: [28.1167, -80.6044],  // Melbourne Beach
    titleKey: "map.markers.paradise-beach.title",
    descriptionKey: "map.markers.paradise-beach.description",
    type: "beach"
  },
  {
    id: "kennedy-space",
    position: [28.5729, -80.6490],  // Kennedy Space Center
    titleKey: "map.markers.kennedy-space.title",
    descriptionKey: "map.markers.kennedy-space.description",
    type: "space_center"
  },
  {
    id: "eau-gallie-arts",
    position: [28.1289, -80.6249],  // Arts district
    titleKey: "map.markers.eau-gallie-arts.title",
    descriptionKey: "map.markers.eau-gallie-arts.description",
    type: "arts"
  },
  {
    id: "intracoastal-brewing",
    position: [28.1312, -80.6275],  // Dining example
    titleKey: "map.markers.intracoastal-brewing.title",
    descriptionKey: "map.markers.intracoastal-brewing.description",
    type: "dining"
  }
]
