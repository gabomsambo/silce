# PRP: Interactive Map Component with React Leaflet

## Goal
Replace the current static SVG map visualization in `DiscoverLocationSection.tsx` with a fully interactive React Leaflet map showing Eau Gallie, Melbourne FL area with custom markers for properties, beaches, attractions, and points of interest.

## Why
- **User Experience**: Current static SVG map with hover pins is confusing and doesn't provide real geographic context
- **Trust & Transparency**: Real map shows actual distances and locations, building confidence in property positioning
- **Engagement**: Interactive panning/zooming allows users to explore the neighborhood at their own pace
- **Professional Appearance**: Matches user expectations for modern property listing websites

## What
An interactive OpenStreetMap-based component with custom-styled markers showing:
- StayLokal properties (tan marker with pulse animation)
- Atlantic beaches (blue markers)
- Kennedy Space Center (red marker)
- Eau Gallie Arts District (purple marker)
- Dining locations (orange markers)

### Success Criteria
- [ ] Map loads without errors in Next.js 15 development and production builds
- [ ] Custom markers display with correct colors matching design system
- [ ] Hover tooltips show location names
- [ ] Click popups show location details
- [ ] Map is mobile responsive
- [ ] No TypeScript errors
- [ ] Bundle size increase < 100KB gzipped
- [ ] Works with SSR disabled via dynamic import

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Core Documentation
- url: https://react-leaflet.js.org/docs/start-introduction
  why: Official React Leaflet setup and API reference

- url: https://leafletjs.com/reference.html#marker
  why: Marker API for custom icons and popups

- url: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr
  why: Next.js dynamic import pattern to disable SSR for Leaflet

- url: https://xxlsteve.net/blog/react-leaflet-on-next-15/
  why: Specific guide for React Leaflet + Next.js 15 integration (fixes double-render issue)
  section: "Using dynamic imports" and "Troubleshooting"
  critical: Must use `ssr: false` in dynamic import to avoid "Map container already initialized" error

# Library Comparison Research
- file: PRPs/ai_docs/map-library-comparison.md
  why: Detailed analysis showing why React Leaflet was chosen over Google Maps/Mapbox

# Existing Component Pattern
- file: app/components/DiscoverLocationSection.tsx
  why: Current component to be modified - shows design system usage (MagicCard, tan colors)
  lines: 1-250 (entire component)
  pattern: Two-column layout, MagicCard usage, tan accent color (#D2B48C)

# Similar Interactive Components
- file: app/components/EnhancedGuestExperiences.tsx
  why: Example of client component with state management and responsive grid
  lines: 1-50 (client directive, useState, responsive patterns)
```

### Current Codebase Structure
```bash
silce/
├── app/
│   ├── components/
│   │   ├── DiscoverLocationSection.tsx  # MODIFY: Replace static map
│   │   └── [other components...]
│   ├── page.tsx                          # Uses DiscoverLocationSection
│   └── globals.css                       # MODIFY: Add Leaflet CSS overrides
├── components/
│   └── ui/
│       └── magic-card.tsx                # Design system component (used in map section)
├── package.json                          # MODIFY: Add leaflet dependencies
└── tsconfig.json                         # TypeScript config (already supports dynamic imports)
```

### Desired Codebase Structure
```bash
silce/
├── app/
│   ├── components/
│   │   ├── DiscoverLocationSection.tsx   # MODIFY: Import MapWrapper instead of static SVG
│   │   ├── EauGallieMap.tsx             # CREATE: Core map component with Leaflet
│   │   └── MapWrapper.tsx               # CREATE: Dynamic import wrapper for SSR
│   ├── data/
│   │   └── mapMarkers.ts                # CREATE: Marker data with coordinates
│   └── globals.css                      # MODIFY: Add Leaflet overrides
├── package.json                         # MODIFY: Add dependencies
└── PRPs/
    └── ai_docs/
        └── map-library-comparison.md    # CREATE: Research documentation
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Leaflet + Next.js 15 SSR Issue
// Problem: Leaflet accesses `window` object which doesn't exist during SSR
// Solution: MUST use dynamic import with `ssr: false`
const MapComponent = dynamic(() => import('./EauGallieMap'), { ssr: false })

// CRITICAL: Leaflet CSS import
// Problem: CSS must be imported in component, not globals, to work with dynamic import
// Solution: Import in EauGallieMap.tsx: import "leaflet/dist/leaflet.css"

// CRITICAL: Custom marker icons
// Problem: Default Leaflet marker icons use CDN URLs that may fail
// Solution: Use inline SVG data URIs for custom icons (shown in pseudocode)

// CRITICAL: TypeScript with Leaflet
// Problem: LatLngExpression type requires specific format
// Solution: Use explicit tuples: [number, number] or { lat: number, lng: number }

// GOTCHA: Map container height
// Problem: MapContainer needs explicit height or it collapses to 0px
// Solution: Set min-height on container div or MapContainer style prop

// GOTCHA: Next.js 15 double render in strict mode
// Problem: React 19 strict mode causes map to initialize twice
// Solution: Use react-leaflet@4.2.2-rc.1 or disable strict mode temporarily
```

## Implementation Blueprint

### Data Models and Structure

```typescript
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
    title: "StayLokal Properties",
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
```

### List of Tasks (in dependency order)

```yaml
Task 1: Install Dependencies
  COMMAND: npm install leaflet react-leaflet @types/leaflet
  VERIFY: Check package.json shows correct versions
  CRITICAL: Use exact versions to avoid compatibility issues
    - leaflet: ^1.9.4
    - react-leaflet: ^4.2.1
    - @types/leaflet: ^1.9.8

Task 2: Create Map Data File
  CREATE: app/data/mapMarkers.ts
  CONTENT: TypeScript interfaces and marker data (see Data Models section above)
  PATTERN: Follow app/data/units.ts structure for consistency
  VERIFY: No TypeScript errors on import

Task 3: Create Core Map Component
  CREATE: app/components/EauGallieMap.tsx
  PATTERN: Follow app/components/EnhancedGuestExperiences.tsx for "use client" pattern
  INJECT: Custom SVG marker icons matching design system colors
  CRITICAL: Import "leaflet/dist/leaflet.css" in this file
  VERIFY: Component renders without errors when dynamically imported

Task 4: Create Dynamic Import Wrapper
  CREATE: app/components/MapWrapper.tsx
  PATTERN: Use Next.js dynamic() with ssr: false
  PRESERVE: Type safety by re-exporting MapMarker interface
  INJECT: Loading skeleton matching MagicCard style
  VERIFY: No SSR errors in development mode

Task 5: Update DiscoverLocationSection
  MODIFY: app/components/DiscoverLocationSection.tsx
  FIND: Lines 58-108 (current static map implementation)
  REPLACE: With <MapWrapper markers={MAP_MARKERS} /> import
  PRESERVE: Existing two-column layout and MagicCard wrapper
  KEEP: All other sections (narrative, highlights grid) unchanged
  VERIFY: Component still renders with new map

Task 6: Add Leaflet CSS Overrides
  MODIFY: app/globals.css
  INJECT: Custom styles for Leaflet popups/tooltips (see pseudocode)
  PATTERN: Match existing design system (tan colors, rounded corners)
  VERIFY: Popups match site aesthetic

Task 7: Create Documentation
  CREATE: PRPs/ai_docs/map-library-comparison.md
  CONTENT: Copy research findings from agent analysis
  WHY: Future reference for why React Leaflet was chosen
```

### Pseudocode for Core Components

```typescript
// Task 3: app/components/EauGallieMap.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import { Icon, LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"  // CRITICAL: Must import here
import { MapMarker } from "@/app/data/mapMarkers"

interface EauGallieMapProps {
  markers: MapMarker[]
  center?: LatLngExpression
  zoom?: number
}

// PATTERN: Custom icon factory function
const getMarkerIcon = (type: MapMarker["type"]) => {
  // COLOR MAPPING: Match design system
  const iconColors = {
    property: "#D2B48C",    // tan (from tailwind.config.ts)
    beach: "#4A90E2",       // blue
    space_center: "#E94B3C", // red
    arts: "#9B59B6",        // purple
    dining: "#F39C12"       // orange
  }

  // GOTCHA: Use data URI for SVG to avoid external dependencies
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${iconColors[type]}" stroke="#fff" stroke-width="2"
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

export default function EauGallieMap({
  markers,
  center = [28.1345, -80.6287],  // Eau Gallie
  zoom = 12  // PATTERN: Zoom level showing ~10 mile radius
}: EauGallieMapProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}  // PATTERN: Disable scroll zoom (UX best practice)
        className="h-full w-full"
        style={{ minHeight: "500px" }}  // CRITICAL: Must have explicit height
      >
        {/* PATTERN: Use OpenStreetMap tiles (free, no API key) */}
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
            {/* PATTERN: Tooltip on hover */}
            <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
              <div className="font-sans">
                <strong>{marker.title}</strong>
              </div>
            </Tooltip>

            {/* PATTERN: Popup on click */}
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

// Task 4: app/components/MapWrapper.tsx
"use client"

import dynamic from "next/dynamic"
import { MapMarker } from "@/app/data/mapMarkers"

interface MapWrapperProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
}

// CRITICAL: ssr: false prevents "window is not defined" error
const EauGallieMap = dynamic(() => import("./EauGallieMap"), {
  loading: () => (
    // PATTERN: Match MagicCard loading skeleton style
    <div className="h-full w-full min-h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan mx-auto mb-4"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  ),
  ssr: false  // CRITICAL: Disable SSR
})

export default function MapWrapper(props: MapWrapperProps) {
  return <EauGallieMap {...props} />
}
```

### Integration Points

```yaml
STYLES:
  - file: app/globals.css
  - add_after: "/* Existing global styles */"
  - pattern: |
      /* Leaflet map customization */
      .leaflet-container {
        font-family: var(--font-geist-sans), Inter, system-ui, sans-serif;
      }

      .leaflet-popup-content-wrapper {
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      }

      .leaflet-tooltip {
        background-color: rgba(26, 26, 26, 0.9);
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .leaflet-popup-tip {
        background-color: white;
      }

COMPONENT_IMPORTS:
  - file: app/components/DiscoverLocationSection.tsx
  - replace_imports: |
      // Remove: MapPin icon import (not needed for real map)
      import MapWrapper from "./MapWrapper"
      import { MAP_MARKERS, EAU_GALLIE_CENTER } from "@/app/data/mapMarkers"

  - replace_jsx: |
      {/* Old static map - REMOVE lines 58-108 */}

      {/* New interactive map */}
      <MagicCard className="p-4">
        <div className="w-full h-[500px]">
          <MapWrapper
            markers={MAP_MARKERS}
            center={EAU_GALLIE_CENTER}
            zoom={12}
          />
        </div>
      </MagicCard>
```

## Validation Loop

### Level 1: Installation & Types
```bash
# Verify dependencies installed
npm list leaflet react-leaflet @types/leaflet

# Expected: Shows version numbers without errors
# If missing: Re-run npm install

# Check TypeScript compilation
npm run build

# Expected: No errors in app/components/EauGallieMap.tsx or MapWrapper.tsx
# If errors: Check import paths and LatLngExpression type usage
```

### Level 2: Development Server
```bash
# Start dev server
npm run dev

# Navigate to: http://localhost:3000
# Scroll to "Discover Eau Gallie" section

# VERIFY:
- [ ] Map loads without console errors
- [ ] Map shows OpenStreetMap tiles centered on Eau Gallie
- [ ] 5 custom markers visible with correct colors
- [ ] Hover over markers shows tooltips
- [ ] Click markers shows popups with details
- [ ] Map is responsive (test mobile view in DevTools)

# If "Map container already initialized" error:
# - Check that dynamic import has ssr: false
# - Try: npm install [email protected]
# - Or temporarily disable strict mode in next.config.mjs

# If markers don't show:
# - Check console for SVG data URI errors
# - Verify marker coordinates are valid [lat, lng] tuples
# - Check getMarkerIcon function returns valid Icon object
```

### Level 3: Production Build
```bash
# Build for production
npm run build

# Expected: Build succeeds with no errors
# Check bundle size report:
# - Look for leaflet chunks in .next/static
# - Should be ~65-80 KB gzipped (acceptable)

# Start production server
npm start

# Navigate to production URL
# Verify map still works identically to dev mode
```

### Level 4: Mobile Responsive Test
```bash
# In browser DevTools:
# 1. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
# 2. Test breakpoints:
#    - Mobile (375px): Map should stack below text
#    - Tablet (768px): Two-column layout
#    - Desktop (1024px+): Full two-column

# VERIFY:
- [ ] Map maintains aspect ratio on mobile
- [ ] Touch gestures work (pinch zoom, pan)
- [ ] Popups don't overflow screen on mobile
- [ ] Loading skeleton shows on slow 3G simulation
```

## Final Validation Checklist
- [ ] Map loads successfully in development: `npm run dev`
- [ ] All 5 markers display with correct colors matching design system
- [ ] Hover tooltips show location names
- [ ] Click popups show descriptions
- [ ] Map is interactive (pan, zoom work)
- [ ] No TypeScript errors: `npm run build`
- [ ] No console errors in browser
- [ ] Mobile responsive (tested at 375px, 768px, 1024px)
- [ ] Production build succeeds with acceptable bundle size
- [ ] Map section matches existing design system aesthetic
- [ ] Loading skeleton displays before map loads
- [ ] OpenStreetMap attribution visible (legal requirement)

---

## Anti-Patterns to Avoid
- ❌ Don't import Leaflet components in server components (use "use client")
- ❌ Don't forget `ssr: false` in dynamic import (causes SSR errors)
- ❌ Don't use default Leaflet marker icons (they rely on external CDN)
- ❌ Don't hardcode coordinates in components (use centralized data file)
- ❌ Don't set map container height to 100% without explicit parent height
- ❌ Don't skip loading state (causes layout shift)
- ❌ Don't remove OpenStreetMap attribution (violates license)
- ❌ Don't enable scrollWheelZoom by default (poor UX, accidental zooming)

## Success Metrics

**One-pass implementation confidence:** 9/10

**Rationale:**
- All dependencies clearly specified with exact versions
- Next.js 15 + React Leaflet integration is well-documented
- Pseudocode includes all critical patterns and gotchas
- Validation steps cover common failure points
- Existing component provides clear structure to follow

**Potential challenges:**
- Next.js 15 double-render issue (mitigated with RC version or strict mode workaround)
- First-time Leaflet setup may require debugging marker icons
- Bundle size monitoring needed to ensure acceptable performance
