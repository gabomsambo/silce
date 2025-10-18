# OG Image Quick Reference Guide

## TL;DR for Silver Pineapple

**Optimal Dimensions:** 1200 × 630px (JPEG, < 150 KB)
**File Format:** JPEG (better compression for property photos)
**Implementation:** Next.js 15 `opengraph-image.tsx` with `next/og` ImageResponse

---

## Essential Specs at a Glance

| Specification | Value |
|---------------|-------|
| **Primary dimensions** | 1200 × 630px |
| **Aspect ratio** | 1.91:1 |
| **File format** | JPEG (recommended) |
| **Max file size** | 5 MB (Twitter), 8 MB (Facebook) |
| **Target file size** | < 300 KB (ideal: 100-150 KB) |
| **Minimum font size** | 48px (for mobile legibility) |
| **Safe text zone** | 120px margin from edges |

---

## 3 Implementation Options

### 1. Static Images (Fastest)
```
/public/og-images/unit-2528.jpg
/public/og-images/unit-2536.jpg
...
```
**Time:** 2-4 hours | **Pros:** Simple, full control | **Cons:** Manual updates

### 2. Dynamic Next.js (Scalable)
```tsx
// app/rooms/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
export default async function Image({ params }) { ... }
```
**Time:** 4-6 hours | **Pros:** Auto-updates, data-driven | **Cons:** Learning curve

### 3. Hybrid (Recommended)
- Static default for homepage
- Dynamic per-unit pages
- Fallback to default if generation fails

---

## Copy-Paste Metadata Template

```tsx
// app/rooms/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const unit = UNITS.find((u) => u.slug === params.slug)

  return {
    title: `${unit.title} | Silver Pineapple`,
    description: `Sleeps ${unit.maxGuests} · ${unit.bedType} · From $${unit.priceFrom}/night`,
    openGraph: {
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · ${unit.bedType} · From $${unit.priceFrom}/night`,
      url: `https://silverpineapple.com/rooms/${unit.slug}`,
      siteName: 'Silver Pineapple',
      images: [
        {
          url: `/rooms/${unit.slug}/opengraph-image`,
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

---

## Minimal Dynamic OG Image Template

```tsx
// app/rooms/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { UNITS } from '@/app/data/units'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const unit = UNITS.find((u) => u.slug === params.slug)

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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#D2B48C' }}>
            🍍 Silver Pineapple
          </div>
          <div
            style={{
              fontSize: 32,
              background: '#D2B48C',
              padding: '12px 24px',
              borderRadius: '8px',
            }}
          >
            From ${unit.priceFrom}/nt
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: 56, fontWeight: 'bold', color: '#1a1a1a', marginBottom: '20px' }}>
          {unit.title}
        </div>

        {/* Details */}
        <div style={{ fontSize: 32, color: '#666', display: 'flex', gap: '30px' }}>
          <span>🛏️ Sleeps {unit.maxGuests}</span>
          <span>🛁 {unit.bathrooms} Bath</span>
          <span>📍 {unit.floor} Floor</span>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', fontSize: 24, color: '#999' }}>
          silverpineapple.com · St. Croix, USVI
        </div>
      </div>
    ),
    { ...size }
  )
}
```

---

## Testing Checklist

- [ ] Preview locally: `http://localhost:3000/rooms/unit-2528/opengraph-image`
- [ ] Build app: `npm run build` (generates static OG images)
- [ ] Test on Facebook: https://developers.facebook.com/tools/debug/
- [ ] Test on Twitter: https://cards-dev.twitter.com/validator
- [ ] Check file size: < 300 KB (ideally < 150 KB)
- [ ] Verify dimensions: Exactly 1200 × 630px
- [ ] Test mobile preview: https://metatags.io/

---

## Design Tools (Free)

1. **Figma Templates:**
   - OG Image Pack 1: https://www.figma.com/community/file/1434530008829243090
   - Search "OG Image" in Figma Community (100+ free templates)

2. **Canva:**
   - Create custom size: 1200 × 630px
   - Search "social media" templates
   - Free tier sufficient for 9 images

3. **OG Studio:**
   - https://ogstudio.app/ (Figma-like editor)
   - Pre-made rental/hospitality templates

4. **Next.js Playground:**
   - https://og-playground.vercel.app/
   - Test ImageResponse code in browser

---

## File Optimization Commands

### Resize + Compress with Sharp (Node.js)
```bash
npm install sharp

# Create script: resize-og.js
const sharp = require('sharp');
sharp('input.jpg')
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 85 })
  .toFile('output.jpg');
```

### Batch Optimize with ImageMagick
```bash
# Install: brew install imagemagick
for file in public/photos_*/1.jpg; do
  convert "$file" -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 "og-images/$(basename $(dirname $file)).jpg"
done
```

### Web-based Compression
- TinyPNG: https://tinypng.com/ (free, 20 images/session)
- Squoosh: https://squoosh.app/ (Google tool, unlimited)

---

## Brand Colors (Silver Pineapple)

```css
--tan-primary: #D2B48C
--dark-neutral: #1a1a1a
--gradient-coastal: linear-gradient(135deg, #D2B48C 0%, #8B7355 100%)
```

---

## Common Mistakes to Avoid

1. ❌ **Using PNG instead of JPEG** (larger file sizes)
2. ❌ **Transparent backgrounds** (breaks on some platforms)
3. ❌ **Font size < 48px** (unreadable on mobile)
4. ❌ **File size > 300 KB** (slow loading on social platforms)
5. ❌ **Forgetting to test on Facebook Debugger** (cache issues)
6. ❌ **Wrong aspect ratio** (causes cropping on social feeds)
7. ❌ **Missing alt text** (accessibility + SEO penalty)

---

## 5-Minute Implementation (Static)

```bash
# 1. Select hero photos
cp public/photos_2528/1.jpg og-source/unit-2528.jpg
# ... repeat for all 9 units

# 2. Create branded overlays in Canva/Figma
# Export as JPEG, 1200 × 630px

# 3. Optimize
npx sharp-cli -i og-source/*.jpg -o public/og-images/ --width 1200 --height 630 --quality 85

# 4. Add to metadata (see template above)
# 5. Test on Facebook Debugger
```

---

## Next Actions for Silver Pineapple

1. **Choose approach:** Static (quick) or Dynamic (scalable)
2. **Gather assets:** Hero photo for each of 9 units
3. **Create first OG image:** Unit 2528 as proof-of-concept
4. **Scale to all units:** Replicate design template
5. **Deploy & test:** Validate on social platforms

**See full guide:** `/PRPs/ai_docs/og-image-best-practices.md` (25 KB, comprehensive)

---

**Quick Reference Version:** 1.0
**Last Updated:** October 2025
