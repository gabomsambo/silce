# OpenGraph & Twitter Card Image Best Practices

## Executive Summary

This document provides comprehensive guidance for implementing OpenGraph (OG) and Twitter Card images for the Silver Pineapple boutique rental website. With 9 unique properties, the strategy balances static and dynamic OG image generation to maximize social media engagement while maintaining performance.

---

## 1. Image Dimensions & Specifications

### Recommended Primary Dimensions

| Platform | Optimal Size | Aspect Ratio | Purpose |
|----------|--------------|--------------|---------|
| **Universal OG** | 1200 × 630px | 1.91:1 | Facebook, LinkedIn, general social sharing |
| **Twitter Card** | 1200 × 628px | 1.91:1 | Twitter/X summary card with large image |
| **Square Fallback** | 1200 × 1200px | 1:1 | WhatsApp, Quora, messaging apps |

**Recommendation for Silver Pineapple:**
- **Primary**: 1200 × 630px (covers 90% of use cases)
- **Optional Square**: 1200 × 1200px for messaging app optimization

### Minimum & Maximum Specifications

| Specification | Value | Notes |
|---------------|-------|-------|
| Minimum dimensions | 600 × 315px | Avoid going below this |
| Absolute minimum | 200 × 200px | Square images only |
| Maximum file size (Twitter) | 5 MB | Hard limit |
| Maximum file size (Facebook) | 8 MB | Hard limit |
| **Recommended file size** | **< 300 KB** | Ideal: 100 KB for performance |
| Maximum resolution | 4096 × 4096px | Unnecessary for OG images |

---

## 2. File Format Recommendations

### JPG vs PNG Performance

| Format | Best For | Pros | Cons |
|--------|----------|------|------|
| **JPEG** | Photographs, property images, gradients | Smaller file size, excellent compression | No transparency support |
| **PNG** | Logos, text-heavy designs, graphics | Lossless quality, transparency | Larger file sizes |
| **WebP** | Modern browsers (Next.js optimized) | Superior compression, transparency | Limited OG platform support (avoid) |

### Recommendation for Silver Pineapple

**Use JPEG for all OG images** because:
1. Property photos compress well (50-150 KB typical)
2. No transparency needed for social sharing
3. Better load performance on social platforms
4. Facebook/Twitter recommend JPG over PNG

**Technical Note:** Transparent PNG backgrounds can cause height/width calculation issues on some platforms.

---

## 3. Design Best Practices for Boutique Rentals

### Visual Hierarchy for Property OG Images

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO: Silver Pineapple]          [BADGE: From $49/nt] │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │         PRIMARY PROPERTY PHOTO                    │   │
│  │         (Hero image from unit data)               │   │
│  │                                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Studio — Comfort · Unit 2538                           │
│  Sleeps 3 · King Bed · Upper Floor                      │
│                                                          │
│  [CTA: "Book Your Stay"] silverpineapple.com            │
└─────────────────────────────────────────────────────────┘
```

### Design Elements for Hospitality Sites

**Must Include:**
- Property photo (high-quality, well-lit interior/exterior)
- Property name/unit number
- Price indicator ("From $49/night")
- Guest capacity ("Sleeps 2-6")
- Brand logo (Silver Pineapple)

**Optional Enhancements:**
- Key amenity icons (WiFi, Kitchen, AC)
- Location indicator ("St. Croix, USVI")
- Review badge ("4.9★ · 127 reviews")
- Subtle coastal gradient overlay (matches brand)

**Avoid:**
- Overcrowding with text
- Low-quality stock photos
- Over-saturated filters
- Transparent backgrounds

### Color & Typography Guidelines

**Brand Colors (from Silver Pineapple theme):**
- Primary tan: `#D2B48C`
- Dark neutral: `#1a1a1a`
- Accent: Coastal gradient overlays (subtle)

**Typography Best Practices:**
- Minimum font size: 48px for main text (legible on mobile previews)
- Maximum 3 font weights per image
- High contrast (dark text on light backgrounds, vice versa)
- Sans-serif fonts for clarity (e.g., Inter, Helvetica)

**Safe Text Zone:**
- Keep critical text 10% away from edges (120px margin on 1200px width)
- Center key information (social platforms sometimes crop edges)

---

## 4. Implementation Strategy for 9 Properties

### Option A: Static OG Images (Simplest)

**Best for:** Quick implementation, consistent branding

**Process:**
1. Create 9 custom OG images (one per unit) using design tools
2. Export as JPEG, optimize to < 150 KB each
3. Store in `/public/og-images/[slug].jpg`
4. Reference in metadata for each unit page

**Pros:** Full design control, no build complexity, cacheable
**Cons:** Manual updates, no dynamic data (price changes)

### Option B: Dynamic OG Images with Next.js 15 (Recommended)

**Best for:** Scalable, data-driven images with automatic updates

**Process:**
1. Use Next.js `opengraph-image.tsx` file convention
2. Generate images dynamically using unit data
3. Leverage `next/og` ImageResponse API
4. Auto-optimize and cache at build time

**Pros:** Data consistency, automatic updates, professional
**Cons:** Learning curve, limited CSS support (flexbox only)

### Option C: Hybrid Approach

**Combine both:**
- Static hero OG image for homepage (`/public/og-default.jpg`)
- Dynamic OG images for 9 individual unit pages
- Fallback to default if dynamic generation fails

---

## 5. Next.js 15 Dynamic OG Image Implementation

### File Structure

```
app/
├── opengraph-image.tsx              # Homepage OG image
├── rooms/
│   └── [slug]/
│       ├── opengraph-image.tsx      # Dynamic unit OG images
│       └── page.tsx
public/
├── og-images/
│   ├── default.jpg                  # Fallback image
│   └── brand-assets/
│       ├── logo.png
│       └── coastal-gradient.jpg
```

### Implementation Example: `/app/rooms/[slug]/opengraph-image.tsx`

```tsx
import { ImageResponse } from 'next/og'
import { UNITS } from '@/app/data/units'

export const runtime = 'edge'
export const alt = 'Silver Pineapple Rental Property'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const unit = UNITS.find((u) => u.slug === params.slug)

  if (!unit) {
    // Fallback to default image
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(135deg, #D2B48C 0%, #8B7355 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Silver Pineapple
        </div>
      ),
      {
        ...size,
      }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
        }}
      >
        {/* Header with Logo and Price */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#D2B48C' }}>
            🍍 Silver Pineapple
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#1a1a1a',
              background: '#D2B48C',
              padding: '12px 24px',
              borderRadius: '8px',
            }}
          >
            From ${unit.priceFrom}/nt
          </div>
        </div>

        {/* Property Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '20px',
          }}
        >
          {unit.title}
        </div>

        {/* Property Details */}
        <div
          style={{
            fontSize: 32,
            color: '#666',
            marginBottom: '40px',
            display: 'flex',
            gap: '30px',
          }}
        >
          <span>🛏️ Sleeps {unit.maxGuests}</span>
          <span>🛁 {unit.bathrooms} Bath</span>
          <span>📍 {unit.floor} Floor</span>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            fontSize: 24,
            color: '#999',
          }}
        >
          silverpineapple.com · St. Croix, USVI
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
```

### Adding Metadata to Unit Pages

In `/app/rooms/[slug]/page.tsx`:

```tsx
import { Metadata } from 'next'
import { UNITS } from '@/app/data/units'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const unit = UNITS.find((u) => u.slug === params.slug)

  if (!unit) {
    return {
      title: 'Property Not Found',
    }
  }

  return {
    title: `${unit.title} | Silver Pineapple`,
    description: `Book ${unit.title} in St. Croix, USVI. Sleeps ${unit.maxGuests}, ${unit.bathrooms} bath. From $${unit.priceFrom}/night.`,
    openGraph: {
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · ${unit.bedType} · ${unit.floor} Floor · From $${unit.priceFrom}/night`,
      url: `https://silverpineapple.com/rooms/${unit.slug}`,
      siteName: 'Silver Pineapple',
      images: [
        {
          url: `/rooms/${unit.slug}/opengraph-image`, // Auto-generated
          width: 1200,
          height: 630,
          alt: unit.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · From $${unit.priceFrom}/night`,
      images: [`/rooms/${unit.slug}/opengraph-image`],
    },
  }
}
```

### Advanced: Using Custom Fonts

```tsx
// Add to opengraph-image.tsx
export default async function Image({ params }: { params: { slug: string } }) {
  // Fetch custom font (optional)
  const fontData = await fetch(
    new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    // ... JSX content
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
```

---

## 6. Using Existing Silver Pineapple Assets

### Available Image Assets (from units.ts)

Each unit has 5-16 photos in `/public/photos_[unit]/`:
- Unit 2528: 10 photos
- Unit 2536: 8 photos
- Unit 2538: 12 photos
- Pineapple 102: 9 photos
- Sea Grape 102: 16 photos
- Unit 2526: 8 photos
- Pineapple 103: 8 photos
- Pineapple 104: 5 photos
- Pineapple 101: 10 photos

**Best Practice:**
Use `images[0]` (first photo) as the hero image for OG cards—these are typically the best-lit, most compelling shots.

### Creating Static OG Images from Existing Photos

**Process:**
1. Select hero photo for each unit (e.g., `/photos_2528/1.jpg`)
2. Use design tool to create branded overlay
3. Export as optimized JPEG (< 150 KB)

**Automation Opportunity:**
- Batch process all 9 hero images with consistent template
- Use tools like ImageMagick or Sharp (Node.js) for overlay automation

---

## 7. Design Tools & Resources

### Free Figma Templates (Recommended)

1. **OG Image Pack 1** (Figma Community)
   - https://www.figma.com/community/file/1434530008829243090
   - 12 startup-focused templates, easily adaptable

2. **OG Image Pack 3** (Figma Community)
   - https://www.figma.com/community/file/1434535803374582485
   - Modern, professional designs for entrepreneurs

3. **OG Image Templates for SaaS** (Figma Community)
   - https://www.figma.com/community/file/1279001851894937188
   - 40+ templates (premium feel, good for boutique brands)

4. **Open Graph Images (Copy & Paste)**
   - https://www.figma.com/community/file/1439179478775358796
   - Battle-tested templates from real products

### Standalone OG Image Tools

1. **OG Studio** (https://ogstudio.app/)
   - Free Figma-like visual editor
   - Pre-made templates for rental/hospitality
   - Export as static or dynamic (URL-based)

2. **Placid.app** (https://placid.app/tools/free-open-graph-image-generator)
   - Free Open Graph generator
   - Template library with real estate themes

3. **Canva** (https://www.canva.com/social-graphics/)
   - Custom dimensions: 1200 × 630px
   - Search "social media" or "Facebook post" templates
   - Free tier sufficient for 9 static images

### Developer Tools

1. **Next.js OG Playground** (https://og-playground.vercel.app/)
   - Test `next/og` ImageResponse in browser
   - See supported CSS properties

2. **ImageMagick** (CLI batch processing)
   ```bash
   # Add text overlay to hero images
   magick photos_2528/1.jpg \
     -gravity south -pointsize 48 -fill white \
     -annotate +0+60 'From $49/night' \
     og-images/unit-2528.jpg
   ```

3. **Sharp (Node.js)** (for programmatic generation)
   ```js
   const sharp = require('sharp')

   sharp('photos_2528/1.jpg')
     .resize(1200, 630, { fit: 'cover' })
     .composite([{ input: 'overlay.png', gravity: 'south' }])
     .jpeg({ quality: 85 })
     .toFile('og-images/unit-2528.jpg')
   ```

---

## 8. Testing & Validation

### Social Media Debug Tools

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Tests OG tags, shows preview, clears cache

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Preview how cards appear on Twitter/X

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Validates LinkedIn-specific OG tags

4. **Meta Tags Checker** (Multi-platform)
   - URL: https://metatags.io/
   - Shows previews for Facebook, Twitter, LinkedIn, Slack

### Local Testing

```bash
# Build Next.js app to generate OG images
npm run build

# OG images generated at build time are in:
# .next/server/app/rooms/[slug]/opengraph-image/route.js

# Preview in browser:
http://localhost:3000/rooms/unit-2528/opengraph-image
```

### Checklist Before Launch

- [ ] All 9 units have unique OG images
- [ ] File sizes < 300 KB (ideally < 150 KB)
- [ ] Dimensions exactly 1200 × 630px
- [ ] Text is legible at 600px width (mobile preview)
- [ ] Brand logo included
- [ ] Price and key specs visible
- [ ] No transparent backgrounds (use solid color or gradient)
- [ ] Tested on Facebook Debugger
- [ ] Tested on Twitter Card Validator
- [ ] Metadata in `page.tsx` matches image content

---

## 9. Performance Optimization

### File Size Reduction Techniques

1. **ImageOptim** (macOS app)
   - Drag/drop JPEG exports
   - Lossless compression (saves 20-40%)

2. **TinyPNG** (https://tinypng.com/)
   - Web-based, free for up to 20 images
   - Smart lossy compression

3. **Next.js Image Optimization** (for static images)
   ```tsx
   // If storing static OG images
   import Image from 'next/image'

   <Image
     src="/og-images/unit-2528.jpg"
     width={1200}
     height={630}
     quality={85}
     alt="OG Image"
   />
   ```

4. **Sharp CLI** (batch optimization)
   ```bash
   # Resize and compress all hero images
   for file in public/photos_*/1.jpg; do
     sharp -i "$file" -o "og-images/$(basename $(dirname $file)).jpg" \
       resize 1200 630 --fit cover --quality 85
   done
   ```

### Caching Strategy

**Next.js Default Behavior:**
- `opengraph-image.tsx` generates images at build time
- Static export to `.next/server/app/.../opengraph-image`
- Cached indefinitely until next build

**Force Regeneration:**
```tsx
// Add to opengraph-image.tsx to regenerate on price changes
export const revalidate = 86400 // 24 hours (if using dynamic data)
```

**CDN Caching (Vercel deployment):**
- OG images auto-cached at edge
- Fast global delivery (< 50ms latency)

---

## 10. SEO Best Practices

### Required OG Tags (Minimum)

```tsx
// In page.tsx metadata
export const metadata: Metadata = {
  openGraph: {
    title: 'Studio — Compact · Unit 2528 | Silver Pineapple',
    description: 'Sleeps 2 · Queen Bed · Ground Floor · From $49/night',
    url: 'https://silverpineapple.com/rooms/unit-2528',
    siteName: 'Silver Pineapple',
    images: [
      {
        url: 'https://silverpineapple.com/rooms/unit-2528/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Studio — Compact · Unit 2528',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

### Recommended Additional Tags

```tsx
openGraph: {
  // ... required tags above
  type: 'website',
  locale: 'en_US',
  countryName: 'United States',
  // Optional: Rich object types for rentals
  // (Not widely supported, but future-proof)
}
```

### Twitter-Specific Tags

```tsx
twitter: {
  card: 'summary_large_image',  // Required
  site: '@SilverPineapple',     // Optional: Twitter handle
  creator: '@SilverPineapple',  // Optional
  title: 'Studio — Compact · Unit 2528',
  description: 'Sleeps 2 · From $49/night',
  images: ['https://silverpineapple.com/rooms/unit-2528/opengraph-image'],
}
```

### Structured Data (JSON-LD)

Complement OG images with structured data for search engines:

```tsx
// Add to page.tsx
export default function UnitPage({ params }: { params: { slug: string } }) {
  const unit = UNITS.find((u) => u.slug === params.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: unit.title,
    description: `${unit.bedType} · Sleeps ${unit.maxGuests}`,
    image: unit.images[0],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Christiansted',
      addressRegion: 'VI',
      addressCountry: 'US',
    },
    offers: {
      '@type': 'Offer',
      price: unit.priceFrom,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... page content */}
    </>
  )
}
```

---

## 11. Recommended Implementation Roadmap

### Phase 1: Quick Win (Static OG Images)

**Timeline: 2-4 hours**

1. Select 1 hero photo per unit (9 total)
2. Use Canva or Figma template to create branded OG images
3. Export as JPEG (1200 × 630px, < 150 KB)
4. Store in `/public/og-images/[slug].jpg`
5. Add OG metadata to each unit page:
   ```tsx
   images: [{ url: `/og-images/${params.slug}.jpg`, width: 1200, height: 630 }]
   ```

**Result:** Functional OG images for all 9 units, ready for social sharing.

### Phase 2: Dynamic Generation (Scalable)

**Timeline: 4-6 hours**

1. Create `/app/rooms/[slug]/opengraph-image.tsx`
2. Implement `ImageResponse` with unit data
3. Test locally (`npm run build` then visit `/rooms/unit-2528/opengraph-image`)
4. Update metadata to reference dynamic images:
   ```tsx
   images: [{ url: `/rooms/${params.slug}/opengraph-image`, ... }]
   ```
5. Deploy to Vercel (auto-optimizes at edge)

**Result:** Auto-updating OG images that reflect price/data changes.

### Phase 3: Advanced Optimization (Optional)

**Timeline: 2-3 hours**

1. Add custom fonts to OG images
2. Incorporate actual property photos (via `next/image` or remote URLs)
3. Create square fallback images (1200 × 1200px)
4. Add locale-specific OG images (if targeting multiple languages)
5. Implement A/B testing for OG image variants

**Result:** Premium, brand-consistent OG images with advanced features.

---

## 12. Common Pitfalls & Solutions

### Issue: OG Image Not Updating on Social Platforms

**Cause:** Facebook/Twitter cache OG images aggressively.

**Solution:**
1. Use Facebook Sharing Debugger to scrape new version
2. Add version query param to image URL:
   ```tsx
   url: `/rooms/${slug}/opengraph-image?v=2`
   ```
3. Wait 24-48 hours for cache expiration

### Issue: File Size Too Large (> 300 KB)

**Cause:** High-resolution photos or PNG format.

**Solution:**
1. Switch to JPEG format
2. Reduce image quality to 80-85%
3. Resize photos to exact dimensions (1200 × 630px)
4. Use compression tools (TinyPNG, ImageOptim)

### Issue: Text Unreadable on Mobile Preview

**Cause:** Font size too small (< 48px).

**Solution:**
1. Increase minimum font size to 48px
2. Use bold font weights (600-700)
3. Add high-contrast backgrounds (dark text on light, vice versa)
4. Test on https://metatags.io/ mobile preview

### Issue: Next.js Build Fails with OG Image Error

**Cause:** File size exceeds 8 MB limit (opengraph-image) or 5 MB (twitter-image).

**Solution:**
1. Check `ImageResponse` content for large embedded images
2. Use remote URLs instead of inlined images
3. Optimize fonts (subset only needed glyphs)
4. Reduce image complexity (simpler gradients, fewer layers)

### Issue: OG Image Shows Wrong Property Data

**Cause:** Stale build cache or incorrect slug matching.

**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Verify slug matches in `UNITS` array:
   ```tsx
   const unit = UNITS.find((u) => u.slug === params.slug)
   if (!unit) { /* fallback */ }
   ```

---

## 13. Resources & References

### Official Documentation

- **Next.js OG Images**: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- **Next.js ImageResponse**: https://nextjs.org/docs/app/api-reference/functions/image-response
- **Facebook Open Graph**: https://developers.facebook.com/docs/sharing/webmasters
- **Twitter Cards**: https://developer.x.com/en/docs/x-for-websites/cards/overview/markup

### Design Inspiration

- **OG Image Gallery**: https://www.ogimage.gallery/ (curated examples)
- **Vacation Rental Websites**: https://mediaboom.com/news/vacation-rental-website-design/
- **Airbnb OG Strategy**: Inspect `view-source:https://www.airbnb.com/rooms/12345`

### Tools & Validators

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Validator**: https://cards-dev.twitter.com/validator
- **Meta Tags Checker**: https://metatags.io/
- **OG Playground**: https://og-playground.vercel.app/

### Figma Templates

- **OG Image Pack 1-3**: Search "OG Image" in Figma Community
- **Real Estate Templates**: Search "property listing" or "rental" in Canva

---

## 14. Next Steps for Silver Pineapple

### Immediate Action Items

1. **Decide on approach:**
   - [ ] Static images (fastest, manual)
   - [ ] Dynamic images (scalable, automated)
   - [ ] Hybrid (default static + dynamic per-unit)

2. **Gather design assets:**
   - [ ] Select hero photo for each of 9 units
   - [ ] Confirm brand colors (#D2B48C tan, #1a1a1a dark)
   - [ ] Export Silver Pineapple logo as PNG (transparent background)

3. **Create first OG image:**
   - [ ] Use Figma template or Canva
   - [ ] Design for Unit 2528 (Studio - Compact)
   - [ ] Export as JPEG, optimize to < 150 KB
   - [ ] Test on Facebook Debugger

4. **Scale to all units:**
   - [ ] Replicate design for remaining 8 units
   - [ ] Store in `/public/og-images/` directory
   - [ ] Update metadata in each `/rooms/[slug]/page.tsx`

5. **Validate & deploy:**
   - [ ] Test all 9 OG images on social platforms
   - [ ] Check file sizes (< 300 KB each)
   - [ ] Deploy to Vercel
   - [ ] Monitor click-through rates from social shares

### Future Enhancements

- Add review count/rating badge to OG images ("4.9★ · 127 reviews")
- Create seasonal OG image variants (holiday promotions)
- A/B test different layouts (photo-focused vs. text-focused)
- Implement dynamic OG images for blog posts (when added)
- Localize OG images for international markets

---

## Conclusion

OpenGraph and Twitter Card images are critical for social media engagement, especially for hospitality businesses where visual appeal drives bookings. For Silver Pineapple's 9 boutique properties, the recommended approach is:

1. **Start with static OG images** (quick win, 2-4 hours)
2. **Migrate to dynamic generation** (scalable, Next.js 15 native)
3. **Optimize for performance** (< 150 KB JPEG, 1200 × 630px)
4. **Test rigorously** (Facebook Debugger, Twitter Validator)

By following this guide, Silver Pineapple will have professional, brand-consistent OG images that maximize click-through rates and showcase each unique property effectively across all major social platforms.

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Author:** Claude (Anthropic)
**Project:** Silver Pineapple Boutique Rentals
