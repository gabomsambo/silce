# Map Library Comparison for Interactive Location Map

## Context
For the DiscoverLocationSection component, we needed to replace a static SVG map with an interactive map showing Eau Gallie, Melbourne FL with custom markers for properties, beaches, attractions, and points of interest.

## Libraries Evaluated

### 1. React Leaflet (SELECTED)
**Pros:**
- Free and open-source with no API keys required
- Uses OpenStreetMap tiles (no usage limits)
- Lightweight (~80KB gzipped including Leaflet core)
- Excellent Next.js 15 compatibility with dynamic imports
- Full TypeScript support via @types/leaflet
- Custom marker icons via data URIs (no external dependencies)
- Active community and well-maintained

**Cons:**
- Requires SSR workaround (dynamic import with ssr: false)
- Peer dependency conflicts with React 19 (resolved with --legacy-peer-deps or react-leaflet@5.x)
- Custom styling needed for popups/tooltips to match design system

**Bundle Impact:**
- leaflet: ~65KB gzipped
- react-leaflet: ~15KB gzipped
- Total: ~80KB acceptable for core feature

### 2. Google Maps API
**Pros:**
- Most familiar UX to users
- Rich feature set (Street View, traffic, etc.)
- Official @googlemaps/react-wrapper library

**Cons:**
- Requires API key and billing account
- $200/month free credit easily exceeded with moderate traffic
- Potential cost concerns for boutique vacation rental site
- Heavier bundle size (~120KB+ gzipped)
- Overkill for simple marker display

**Verdict:** Rejected due to cost and complexity

### 3. Mapbox GL JS
**Pros:**
- Beautiful default styling
- Vector tiles for smooth performance
- Good React integration via react-map-gl

**Cons:**
- Requires API key (50,000 free loads/month then $5/1000)
- Heavier bundle (~150KB gzipped)
- More complex setup for simple use case
- Learning curve for custom markers

**Verdict:** Rejected as overkill for basic location display

### 4. Pigeon Maps (React only)
**Pros:**
- No external dependencies
- Very lightweight (~20KB)
- Pure React component

**Cons:**
- Limited feature set
- Less polished UI
- Smaller community
- No TypeScript definitions

**Verdict:** Rejected due to lack of features and polish

## Decision: React Leaflet

**Rationale:**
1. **Zero Cost**: No API keys or usage limits
2. **Right-Sized**: 80KB is acceptable for core feature
3. **Next.js Compatible**: Well-documented SSR workaround
4. **Customizable**: Full control over marker styling
5. **Professional**: OpenStreetMap is widely trusted
6. **Future-Proof**: Active maintenance and community

## Implementation Notes

### Critical Patterns Discovered

1. **SSR Handling**: Must use `dynamic(() => import('./Map'), { ssr: false })`
2. **React 19 Compatibility**: Use react-leaflet@5.x or --legacy-peer-deps
3. **Custom Icons**: Data URI approach avoids CDN dependencies
4. **Container Height**: Explicit min-height required or map collapses
5. **Scroll Zoom**: Disabled by default for better UX

### Design System Integration

Custom styles added to globals.css:
- Tooltips: Dark background (#1a1a1a) with white text
- Popups: Rounded corners (0.75rem) matching design system
- Font: Inter matching site typography

### Marker Color Mapping

- Property (tan #D2B48C): Brand color for StayLokal
- Beach (blue #4A90E2): Water/ocean theme
- Space Center (red #E94B3C): Rocket/space theme
- Arts (purple #9B59B6): Creative/cultural theme
- Dining (orange #F39C12): Food/warmth theme

## Future Enhancements (Not Implemented)

- Clustering for multiple properties
- Custom map tiles with brand styling
- Directions integration
- Geolocation "center on me" button
- Mobile-specific touch interactions

## Resources

- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Leaflet API Reference](https://leafletjs.com/reference.html)
- [Next.js 15 + React Leaflet Guide](https://xxlsteve.net/blog/react-leaflet-on-next-15/)
- [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)

---

**Decision Date:** 2025-10-04
**Implemented By:** Claude Code (PRP: interactive-map-implementation.md)
