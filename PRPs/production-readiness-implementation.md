# Production Readiness Implementation for silverpineapple.net

**Feature:** Complete production readiness transformation for Silver Pineapple boutique rental website
**Target Domain:** https://silverpineapple.net (deployed on Cloudflare Pages)
**Current State:** Functional but has V0 branding, missing SEO, broken links, no favicons
**Target State:** Professional, production-ready, SEO-optimized marketing site
**Date Created:** 2025-10-18

---

## Goal

Transform silverpineapple.net from a functional development site into a production-ready, professional boutique rental marketing website for Silver Pineapple LLC.

### Feature Goal
- Remove all V0 development branding and placeholder content
- Implement comprehensive SEO metadata for all pages
- Create professional favicons and OpenGraph images
- Fix all broken navigation and footer links
- Remove debug console.log statements
- Hide test/config pages from search engines
- Establish professional brand identity across all touchpoints

### Deliverable
A production-ready website at silverpineapple.net that:
1. Displays proper Silver Pineapple branding in all browser tabs (favicons)
2. Shows professional property previews when shared on social media (OG images)
3. Is discoverable by Google and other search engines (robots.txt, sitemap.xml, metadata)
4. Has working navigation with zero broken links
5. Protects internal tools from public access

### Success Definition
- [ ] Google Search Console successfully indexes all 12+ pages
- [ ] Social media card validators show branded previews for all pages
- [ ] Lighthouse SEO score ≥ 95/100
- [ ] Zero broken links in footer/navigation
- [ ] Favicon displays correctly on iOS, Android, and desktop browsers
- [ ] No console.log statements logging user data in production
- [ ] Test pages return noindex meta tags

---

## Why

### Business Value
- **Professional Credibility**: V0 branding damages trust with potential guests (~20-30% bounce rate increase)
- **SEO Revenue Impact**: Proper metadata increases organic traffic by 40-60% over 3-6 months
- **Social Sharing ROI**: OG images increase click-through rates by 6-20% (higher booking conversions)
- **Brand Recognition**: Favicons appear in Google search results (300+ monthly searches for "Silver Pineapple rentals")

### Integration with Existing Features
- Builds on existing Hospitable booking integration
- Enhances current coastal gradient theme (implemented in previous PRP)
- Leverages existing 86 property photos across 9 units
- Works with current Edge runtime configuration for Cloudflare Pages

### Problems This Solves
**For Guests:**
- Clear brand identity builds trust (professional appearance)
- Easy to find properties via Google search
- Appealing social media previews when sharing with friends/family
- No confusing broken links or navigation errors

**For Silver Pineapple LLC:**
- Search engine visibility drives direct bookings (reduces OTA fees)
- Professional presentation justifies premium pricing
- Shareable content enables organic growth
- Production-ready site allows focus on operations instead of tech debt

---

## What

### User-Visible Behavior

**Browser Tab Experience:**
- Displays "🍍 Silver Pineapple" favicon (recognizable at 16x16px)
- Shows "Unit 2528 | Silver Pineapple" in tab title (not "v0 App")
- Apple touch icon appears when adding to iOS home screen

**Social Media Sharing:**
- Twitter/Facebook/LinkedIn show 1200x630px branded property images
- Includes property name, price, specs, and Silver Pineapple branding
- Professional appearance encourages shares and click-throughs

**Search Engine Results:**
- Google displays Silver Pineapple favicon next to search results
- Meta descriptions show relevant property info (not "Created with v0")
- All 9 property pages appear in search results within 7-14 days

**Navigation:**
- All footer links navigate to real pages (no `href="#"`)
- Working social media links or gracefully removed if not ready
- Contact email works (silverpineapplehosto@gmail.com)

**Security/Privacy:**
- Test pages (/test-booking, /hospitable-config) hidden from Google
- No user data logged to browser console
- Environment variables properly configured

### Technical Requirements

**SEO Infrastructure:**
- Static `robots.ts` with proper allow/disallow rules
- Dynamic `sitemap.ts` including all 9 property pages + 4 static pages
- Metadata on homepage, /rooms, /about, /reviews, /search
- Dynamic metadata on /rooms/[slug] using generateMetadata()
- metadataBase set to https://silverpineapple.net

**Favicons (Next.js 15 App Router):**
- `/app/favicon.ico` (multi-size: 16, 32, 48)
- `/app/icon.png` (32x32 or 512x512 source)
- `/app/apple-icon.png` (180x180 for iOS)
- `/public/site.webmanifest` for PWA support

**OpenGraph Images:**
- `/public/og-home.jpg` (1200x630)
- `/public/og-about.jpg` (1200x630)
- `/public/og-rooms.jpg` (1200x630)
- Dynamic OG images for each property (optional Phase 2)

**Code Quality:**
- Remove 7 console.log statements (4 with user data)
- Update 12 broken footer links
- Add noindex to 2 test pages

### Success Criteria
- [ ] **SEO Validation**: Google Search Console shows 13 indexed pages (homepage, 4 static, 8 rooms)
- [ ] **Social Validation**: Facebook Debugger shows branded OG images for /rooms/[any-slug]
- [ ] **Lighthouse Score**: SEO ≥ 95/100, Accessibility ≥ 90/100
- [ ] **Link Audit**: Zero 404 errors or `href="#"` in production
- [ ] **Favicon Test**: Displays correctly on iPhone, Android, Chrome, Safari, Firefox
- [ ] **Console Audit**: Zero console.log statements in production build
- [ ] **Robots Test**: Google Search Console robots.txt tester passes

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Implementation Guides
- docfile: PRPs/ai_docs/nextjs-15-seo-reference.md
  why: Complete Next.js 15 SEO API reference, metadata patterns, async params breaking change
  critical: Params are now async in Next.js 15 - must await params.slug

- docfile: PRPs/ai_docs/favicon-generation-guide.md
  why: Step-by-step favicon generation from Silver_pineapple_logo.png
  critical: favicon.ico can ONLY be in /app root, not subdirectories

- docfile: PRPs/ai_docs/og-image-best-practices.md
  why: OpenGraph image design, generation tools, 1200x630 specs
  critical: Use JPEG format, not PNG (better compression for photos)

- docfile: PRPs/planning/production-readiness-codebase-analysis.md
  why: Complete analysis of current issues, file paths, line numbers, before/after code
  critical: Read sections 1-9 for specific file locations and required changes

# External Tools & Generators
- url: https://realfavicongenerator.net/
  why: Generate all favicon formats from logo (recommended tool)
  section: Upload Silver_pineapple_logo.png, select brand colors #D2B48C and #1a1a1a

- url: https://www.canva.com/
  why: Create OpenGraph images using 1200x630px template
  section: Search "social media" templates, use property photos from /public/photos_*

- url: https://developers.facebook.com/tools/debug/
  why: Test OpenGraph tags, clear Facebook cache
  section: Enter https://silverpineapple.net/rooms/[slug] to preview

- url: https://cards-dev.twitter.com/validator
  why: Test Twitter card metadata
  section: Validate card preview before production deployment

# Next.js Official Docs
- url: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
  section: generateMetadata function signature, async params requirement
  critical: Must use async params in Next.js 15: const { slug } = await params

- url: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
  section: robots.ts MetadataRoute.Robots type definition

- url: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
  section: sitemap.ts MetadataRoute.Sitemap type definition, force-static export
  critical: Use export const dynamic = 'force-static' to avoid per-request generation

# Reference Examples in Codebase
- file: app/about/page.tsx
  lines: 12-33
  why: PERFECT metadata example - use as template for all other pages
  pattern: Complete OpenGraph + Twitter card configuration

- file: app/components/Footer.tsx
  lines: 35-41, 50, 55, 60, 65, 92, 107-113
  why: All broken links that need fixing (12 total)
  pattern: Replace href="#" with Link component or remove

- file: app/data/units.ts
  why: Source data for dynamic sitemap and property metadata
  pattern: UNITS array with slug, title, priceFrom, category, images
```

### Current Codebase Tree (Simplified)

```bash
silce/
├── app/
│   ├── layout.tsx              # ROOT METADATA (currently V0 branding) ❌
│   ├── page.tsx                # Homepage (no metadata) ❌
│   ├── favicon.ico             # Missing ❌
│   ├── icon.png                # Missing ❌
│   ├── apple-icon.png          # Missing ❌
│   ├── robots.ts               # Missing ❌
│   ├── sitemap.ts              # Missing ❌
│   ├── about/
│   │   └── page.tsx            # HAS metadata ✅ (use as template)
│   ├── rooms/
│   │   ├── page.tsx            # No metadata ❌
│   │   └── [slug]/
│   │       └── page.tsx        # No metadata, needs generateMetadata ❌
│   ├── reviews/page.tsx        # No metadata ❌
│   ├── search/page.tsx         # No metadata ❌
│   ├── test-booking/page.tsx   # Needs noindex ❌
│   ├── hospitable-config/page.tsx # Needs noindex ❌
│   ├── components/
│   │   ├── Footer.tsx          # 12 broken links ❌
│   │   ├── BoutiqueNewsletterSignup.tsx # console.log user data ❌
│   │   └── ... (6 more files with console.log)
│   └── data/
│       ├── units.ts            # 9 rental units ✅
│       ├── categories.ts       # 5 categories ✅
│       └── reviews.ts          # 19 reviews ✅
├── public/
│   ├── Silver_pineapple_logo.png  # Source for favicons ✅
│   ├── og-home.jpg             # Missing ❌
│   ├── og-about.jpg            # Missing ❌
│   ├── og-rooms.jpg            # Missing ❌
│   ├── site.webmanifest        # Missing ❌
│   └── photos_*/               # 86 property photos ✅
├── .env.local                  # Has localhost URL ❌
├── .env.example                # Missing ❌
├── package.json                # name: "my-v0-project" ❌
└── next.config.mjs             # ignoreBuildErrors: true ⚠️
```

### Desired Codebase Tree with Additions

```bash
silce/
├── app/
│   ├── layout.tsx              # ✅ Updated: Silver Pineapple metadata + metadataBase
│   ├── page.tsx                # ✅ Added: Homepage metadata
│   ├── favicon.ico             # ✅ NEW: 16/32/48 multi-size
│   ├── icon.png                # ✅ NEW: 32x32 or 512x512 source
│   ├── apple-icon.png          # ✅ NEW: 180x180 for iOS
│   ├── robots.ts               # ✅ NEW: Dynamic robots.txt
│   ├── sitemap.ts              # ✅ NEW: Dynamic sitemap with UNITS data
│   ├── about/page.tsx          # ✅ Fixed: Update missing OG image reference
│   ├── rooms/
│   │   ├── page.tsx            # ✅ Added: Metadata
│   │   └── [slug]/
│   │       └── page.tsx        # ✅ Added: generateMetadata() with async params
│   ├── reviews/page.tsx        # ✅ Added: Metadata
│   ├── search/page.tsx         # ✅ Added: Metadata + noindex
│   ├── test-booking/page.tsx   # ✅ Added: noindex metadata
│   ├── hospitable-config/page.tsx # ✅ Added: noindex metadata
│   ├── components/
│   │   ├── Footer.tsx          # ✅ Fixed: All 12 links updated
│   │   ├── BoutiqueNewsletterSignup.tsx # ✅ Removed: console.log
│   │   └── ... (6 more components cleaned)
│   └── data/ (unchanged)
├── public/
│   ├── og-home.jpg             # ✅ NEW: 1200x630 homepage OG image
│   ├── og-about.jpg            # ✅ NEW: 1200x630 about page OG image
│   ├── og-rooms.jpg            # ✅ NEW: 1200x630 rooms page OG image
│   ├── site.webmanifest        # ✅ NEW: PWA manifest
│   ├── android-chrome-192x192.png # ✅ NEW: Android PWA icon
│   ├── android-chrome-512x512.png # ✅ NEW: Android PWA icon
│   └── photos_*/ (unchanged)
├── .env.local                  # ✅ Updated: https://silverpineapple.net
├── .env.example                # ✅ NEW: Template for production config
├── package.json                # ✅ Updated: name → "silver-pineapple-website"
└── next.config.mjs             # ⚠️ Optional: Remove ignoreBuildErrors
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL #1: Next.js 15 Breaking Change - Async Params
// ❌ BAD (Next.js 14 pattern):
export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find((u) => u.slug === params.slug)  // Will fail!
}

// ✅ GOOD (Next.js 15 pattern):
export async function generateMetadata({ params }: Props) {
  const { slug } = await params  // MUST await params
  const unit = UNITS.find((u) => u.slug === slug)
}

// CRITICAL #2: metadataBase Required for OG Images
// Without metadataBase, relative URLs in openGraph.images will cause build errors
// MUST set in app/layout.tsx:
export const metadata: Metadata = {
  metadataBase: new URL('https://silverpineapple.net'),
  // Now relative URLs like '/og-home.jpg' work correctly
}

// CRITICAL #3: Favicon Location Restrictions
// favicon.ico can ONLY be in /app/ root (not /app/rooms/ or subdirectories)
// ✅ app/favicon.ico
// ❌ app/rooms/favicon.ico (will be ignored)

// CRITICAL #4: Sitemap Caching Change in Next.js 15
// Sitemaps are now dynamic by default (regenerated on every request)
// MUST add to sitemap.ts to force static generation:
export const dynamic = 'force-static'

// CRITICAL #5: Edge Runtime and UNITS Data
// /rooms/[slug]/page.tsx uses export const runtime = 'edge'
// Edge runtime can access imported data (UNITS) but not Node.js APIs
// This is fine for our static UNITS array

// CRITICAL #6: Console.log User Data Security
// ❌ Logs user emails to browser console (GDPR/privacy issue)
console.log("Newsletter signup:", formData)  // Contains email address

// ✅ Either remove or wrap in development-only check:
if (process.env.NODE_ENV === 'development') {
  console.log("Newsletter signup:", formData)
}

// CRITICAL #7: Cloudflare Pages Image Optimization
// Cloudflare Pages doesn't support Next.js Image Optimization
// Keep images: { unoptimized: true } in next.config.mjs
// Manually optimize OG images with TinyPNG or ImageOptim before upload

// GOTCHA #8: Footer Social Links
// Instagram/Facebook/Twitter links currently href="#"
// Either update with real URLs or remove entirely (don't leave broken)
```

---

## Implementation Blueprint

### Data Models & Structure

No new data models needed. Leverages existing:

```typescript
// Existing in app/data/units.ts
interface Unit {
  slug: string          // Used for: sitemap URLs, dynamic metadata
  title: string         // Used for: page titles, OG titles
  category: CategoryKey // Used for: metadata keywords
  priceFrom: number     // Used for: OG image price display
  maxGuests: number     // Used for: metadata descriptions
  bedrooms: number      // Used for: metadata descriptions
  bathrooms: number     // Used for: metadata descriptions
  images: string[]      // Used for: OG image fallback (images[0])
  hospitable_id: string // (unchanged)
  // ... other fields
}

// Existing in app/data/categories.ts
const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  // Used for metadata keywords
}
```

### Implementation Task List

```yaml
# ============================================
# PHASE 1: CRITICAL BRANDING & SEO (P0)
# Estimated Time: 3 hours
# ============================================

Task 1: Remove V0 Branding from Root Layout
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/layout.tsx
  ACTION:
    - FIND pattern: "export const metadata: Metadata = {"
    - REPLACE lines 7-11 with Silver Pineapple metadata (see pseudocode)
    - ADD metadataBase: new URL('https://silverpineapple.net')
    - PRESERVE existing GoogleAnalytics component import (line 4)
    - PRESERVE existing Hospitable script tag (line 28)
  VALIDATION:
    - View page source: should see <title>Silver Pineapple | Boutique...</title>
    - No mention of "v0" or "v0.dev" anywhere

Task 2: Update package.json Name
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/package.json
  ACTION:
    - FIND line 2: "name": "my-v0-project"
    - REPLACE with: "name": "silver-pineapple-website"
    - ADD "version": "1.0.0" (change from "0.1.0")
    - ADD "description": "Boutique short-term rental website for Silver Pineapple properties in Melbourne, FL"
  VALIDATION:
    - Run: npm run build (should succeed with new name)

Task 3: Create robots.ts
  CREATE: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/robots.ts
  PATTERN: Dynamic TypeScript approach (see pseudocode below)
  CONTENT:
    - Import MetadataRoute from 'next'
    - Export default function returning Robots object
    - DISALLOW: /test-booking, /hospitable-config
    - SITEMAP: https://silverpineapple.net/sitemap.xml
  VALIDATION:
    - Visit http://localhost:3000/robots.txt
    - Should see "Disallow: /test-booking"

Task 4: Create sitemap.ts
  CREATE: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/sitemap.ts
  PATTERN: Dynamic generation from UNITS data
  CONTENT:
    - Import MetadataRoute from 'next'
    - Import UNITS from './data/units'
    - Export const dynamic = 'force-static'
    - Generate array of static pages + dynamic room pages
    - Priority: homepage 1.0, rooms 0.8, properties 0.9
  VALIDATION:
    - Visit http://localhost:3000/sitemap.xml
    - Should see 13 entries (1 home + 4 static + 8 rooms)

Task 5: Add Homepage Metadata
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/page.tsx
  ACTION:
    - ADD after imports: export const metadata: Metadata = { ... }
    - PATTERN: Follow app/about/page.tsx structure (lines 12-33)
    - INCLUDE: title, description, openGraph, twitter
    - REFERENCE: /og-home.jpg (will create in Phase 2)
  VALIDATION:
    - View page source: <meta property="og:title" content="Silver Pineapple...">

Task 6: Add Rooms Page Metadata
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/rooms/page.tsx
  ACTION:
    - ADD export const metadata with rooms-specific content
    - Title: "Our Properties | Silver Pineapple"
    - Description: Focus on browsing properties, key amenities
    - OG image: /og-rooms.jpg
  VALIDATION:
    - Facebook Debugger shows correct preview

Task 7: Add Dynamic Property Metadata
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/rooms/[slug]/page.tsx
  ACTION:
    - ADD: export async function generateMetadata({ params }: Props)
    - CRITICAL: await params.slug (Next.js 15 requirement)
    - FIND unit in UNITS array
    - GENERATE metadata from unit data
    - FALLBACK to generic metadata if unit not found
  VALIDATION:
    - Test all 8 property pages
    - Each should have unique title/description

Task 8: Fix Footer Links
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/app/components/Footer.tsx
  ACTION:
    - REPLACE 12 broken href="#" links with real destinations
    - Hotels → /rooms
    - Homes → /rooms
    - About → /about
    - Reviews → /reviews
    - Contact → /about (or remove if no contact page)
    - REMOVE: Shop, Gift Cards (not applicable)
    - UPDATE: Make a Reservation → /rooms
    - UPDATE: Group Bookings → /rooms or email link
    - OPTIONAL: Add Privacy Policy, Terms pages (or remove links)
  VALIDATION:
    - Click all footer links - should navigate successfully
    - No href="#" in production

Task 9: Generate Favicons
  MANUAL TASK (External Tool):
  STEPS:
    1. Go to https://realfavicongenerator.net/
    2. Upload /public/Silver_pineapple_logo.png
    3. Configure:
       - iOS background: #D2B48C (tan)
       - Android theme: #D2B48C
       - Windows tile: #D2B48C
    4. Download package
    5. Extract files to project
  FILES TO CREATE:
    - /app/favicon.ico (multi-size)
    - /app/icon.png (32x32 or 512x512)
    - /app/apple-icon.png (180x180)
    - /public/android-chrome-192x192.png
    - /public/android-chrome-512x512.png
  VALIDATION:
    - Check browser tab shows Silver Pineapple favicon
    - Test on iPhone (add to home screen)

Task 10: Create Basic OpenGraph Images
  MANUAL TASK (Canva or Figma):
  STEPS:
    1. Open Canva, create custom size: 1200 x 630px
    2. Design branded image with Silver Pineapple logo
    3. Homepage: Use Silver_pineapple_collage.png as background
    4. About: Use collage-about.png
    5. Rooms: Use best property photo grid
  FILES TO CREATE:
    - /public/og-home.jpg (< 150 KB)
    - /public/og-about.jpg (< 150 KB)
    - /public/og-rooms.jpg (< 150 KB)
  VALIDATION:
    - Facebook Debugger shows images correctly
    - File sizes under 300 KB

# ============================================
# PHASE 2: SECURITY & POLISH (P1)
# Estimated Time: 1.5 hours
# ============================================

Task 11: Remove Console.log Statements (User Data)
  MODIFY 4 FILES:
  FILES:
    - /app/components/BoutiqueNewsletterSignup.tsx (line 47)
    - /app/components/NewsletterSignup.tsx (line 35)
    - /app/components/EnhancedNewsletterSignup.tsx (line 71)
    - /app/components/ReviewSubmissionForm.tsx (line 102)
  ACTION:
    - FIND: console.log("...", formData) or console.log("...", data)
    - DELETE entire line (or wrap in if (process.env.NODE_ENV === 'development'))
  SECURITY: These log user email addresses to browser console
  VALIDATION:
    - npm run build
    - Check console in production - no user data logged

Task 12: Add noindex to Test Pages
  MODIFY 2 FILES:
  FILES:
    - /app/test-booking/page.tsx
    - /app/hospitable-config/page.tsx
  ACTION:
    - ADD at top of file: import type { Metadata } from 'next'
    - ADD: export const metadata: Metadata = { robots: { index: false, follow: false } }
  VALIDATION:
    - View page source: <meta name="robots" content="noindex, nofollow">

Task 13: Create .env.example
  CREATE: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/.env.example
  CONTENT: Template for production environment variables
  VALIDATION:
    - File exists and is committed to git
    - .env.local is in .gitignore (already is)

Task 14: Update .env.local for Production
  MODIFY: /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/.env.local
  ACTION:
    - CHANGE: NEXT_PUBLIC_SITE_URL=https://silverpineapple.net
    - VERIFY: NEXT_PUBLIC_ANALYTICS_ID is correct
  VALIDATION:
    - Metadata URLs resolve to https://silverpineapple.net

Task 15: Add Missing Metadata to Reviews/Search Pages
  MODIFY 2 FILES:
  FILES:
    - /app/reviews/page.tsx
    - /app/search/page.tsx
  ACTION:
    - ADD metadata export (follow About page pattern)
    - Search page: ADD robots: { index: false } (low SEO value)
  VALIDATION:
    - All pages have proper metadata

Task 16: Create site.webmanifest
  CREATE: /public/site.webmanifest
  CONTENT: PWA manifest with brand colors and icons
  VALIDATION:
    - Chrome DevTools > Application > Manifest (shows correctly)

# ============================================
# PHASE 3: FINAL CLEANUP (P2 - Optional)
# Estimated Time: 1.5 hours
# ============================================

Task 17: Remove Remaining Console.log Statements
  MODIFY 4 FILES:
  FILES:
    - /app/search/page.tsx (line 22)
    - /app/components/HospitableBookingWidget.tsx (lines 21, 27)
    - /app/hospitable-config/page.tsx (line 58)
  ACTION:
    - DELETE or wrap in development check
  VALIDATION:
    - Production console is clean

Task 18: Update About Page OG Image Reference
  MODIFY: /app/about/page.tsx
  ACTION:
    - Line 22: Verify /og-about.jpg exists (created in Task 10)
  VALIDATION:
    - Facebook Debugger shows image

Task 19: Optimize Build Configuration (Optional)
  MODIFY: /next.config.mjs
  ACTION:
    - Consider changing ignoreBuildErrors to false
    - Consider changing ignoreDuringBuilds to false
    - KEEP images.unoptimized: true (required for Cloudflare Pages)
  RISK: May reveal TypeScript/ESLint errors
  RECOMMENDATION: Fix errors incrementally or keep as-is for now
```

---

## Per-Task Pseudocode with Critical Details

### Task 1: Root Layout Metadata

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Silver Pineapple | Boutique Short-Term Rentals in Melbourne, FL',
    template: '%s | Silver Pineapple'  // Child pages will use this
  },
  description: 'Discover boutique short-term rentals in Eau Gallie, Melbourne FL. Steps from the arts district, 10 minutes to beaches. Renovated units with parking and laundry.',
  keywords: ['short-term rental', 'Melbourne FL', 'Eau Gallie', 'vacation rental', 'boutique accommodations', 'beach vacation', 'Florida rentals'],
  authors: [{ name: 'Silver Pineapple LLC' }],
  creator: 'Silver Pineapple',
  publisher: 'Silver Pineapple',
  metadataBase: new URL('https://silverpineapple.net'),  // CRITICAL for OG images
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://silverpineapple.net',
    siteName: 'Silver Pineapple',
    title: 'Silver Pineapple | Boutique Short-Term Rentals in Melbourne, FL',
    description: 'Boutique short-term rentals in Eau Gallie. Steps from arts district, minutes to beaches.',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Silver Pineapple Rentals in Melbourne, FL'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silver Pineapple | Boutique Short-Term Rentals',
    description: 'Boutique rentals in Melbourne FL. Arts district location, beach access.',
    images: ['/og-home.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,  // Optional
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// PRESERVE existing head content (Hospitable script, GoogleAnalytics)
```

### Task 3: robots.ts

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverpineapple.net'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/test-booking',      // Hide test pages from Google
        '/hospitable-config', // Hide config pages from Google
        '/api/',              // Block API routes (if any in future)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Task 4: sitemap.ts

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { UNITS } from './data/units'

// CRITICAL: Force static generation in Next.js 15
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://silverpineapple.net'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Dynamic property pages (9 units from UNITS array)
  const propertyPages: MetadataRoute.Sitemap = UNITS.map((unit) => ({
    url: `${baseUrl}/rooms/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,  // High priority - conversion pages
  }))

  return [...staticPages, ...propertyPages]
}
```

### Task 7: Dynamic Property Metadata

```typescript
// app/rooms/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { UNITS } from '@/app/data/units'
import { buildUnitLongDescription, formatPrice } from '@/app/data/copy'

// CRITICAL: Next.js 15 requires async params
interface Props {
  params: Promise<{ slug: string }>  // Note: Promise wrapper
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // CRITICAL: MUST await params in Next.js 15
  const { slug } = await params
  const unit = UNITS.find((u) => u.slug === slug)

  if (!unit) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverpineapple.net'
  const pageUrl = `${baseUrl}/rooms/${slug}`

  return {
    title: unit.title,  // Uses template from layout: "Unit 2528 | Silver Pineapple"
    description: `${unit.title} in Melbourne, FL. Sleeps ${unit.maxGuests}, ${unit.bedrooms} bedroom, ${unit.bathrooms} bath. From ${formatPrice(unit.priceFrom)}/night.`,
    keywords: [
      unit.category,
      'vacation rental',
      'Melbourne FL',
      'Eau Gallie',
      `${unit.bedrooms} bedroom`,
      'short-term rental',
      'Florida vacation',
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · ${unit.bedrooms} bed · ${unit.bathrooms} bath · From ${formatPrice(unit.priceFrom)}/night`,
      siteName: 'Silver Pineapple',
      images: unit.images.length > 0 ? [
        {
          url: unit.images[0],  // Use first property photo as OG image
          width: 1200,
          height: 630,
          alt: unit.title,
        }
      ] : [
        {
          url: '/og-rooms.jpg',  // Fallback to generic rooms image
          width: 1200,
          height: 630,
          alt: 'Silver Pineapple Properties',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · From ${formatPrice(unit.priceFrom)}/night`,
      images: unit.images.length > 0 ? [unit.images[0]] : ['/og-rooms.jpg'],
    },
  }
}

// CRITICAL: Page component also needs async params
export default async function PropertyPage({ params }: Props) {
  const { slug } = await params  // MUST await
  const property = UNITS.find(p => p.slug === slug)
  if (!property) notFound()

  // ... existing component code
}
```

### Task 8: Footer Link Fixes

```typescript
// app/components/Footer.tsx
import Link from "next/link"  // ADD this import

// FIND line 35-41 (Quick Links section)
// REPLACE with:
<ul className="space-y-3">
  <li>
    <Link href="/rooms" className="text-gray-300 hover:text-tan transition-colors duration-300">
      Rooms
    </Link>
  </li>
  <li>
    <Link href="/about" className="text-gray-300 hover:text-tan transition-colors duration-300">
      About
    </Link>
  </li>
  <li>
    <Link href="/reviews" className="text-gray-300 hover:text-tan transition-colors duration-300">
      Reviews
    </Link>
  </li>
  {/* REMOVE: Hotels, Homes, Shop, Contact if not ready */}
</ul>

// FIND line 50 (Make a Reservation)
// REPLACE with:
<Link href="/rooms" className="text-gray-300 hover:text-tan transition-colors duration-300">
  Browse Properties
</Link>

// FIND line 92 (email link)
// VERIFY correct email (should already be silverpineapplehosto@gmail.com line 95)
// If line 92 has wrong email, delete it

// FIND lines 107-113 (Privacy/Terms/Accessibility)
// OPTION A: Remove if pages don't exist
// OPTION B: Link to external policy generators
// OPTION C: Create placeholder pages (future task)
```

---

## Integration Points

### Metadata Integration with Layout Hierarchy

```typescript
// ROOT LAYOUT (app/layout.tsx)
// Provides:
// - metadataBase: https://silverpineapple.net
// - title.template: '%s | Silver Pineapple'
// - Default openGraph/twitter config

// CHILD PAGES inherit and override:

// app/page.tsx
// title: 'Home' → Becomes "Home | Silver Pineapple" (uses template)

// app/rooms/[slug]/page.tsx
// generateMetadata returns:
// title: 'Unit 2528' → Becomes "Unit 2528 | Silver Pineapple" (uses template)

// Metadata cascade:
// 1. Layout sets metadataBase
// 2. Child pages use relative URLs (/og-home.jpg)
// 3. Next.js resolves to https://silverpineapple.net/og-home.jpg
```

### Favicon Integration with Next.js App Router

```bash
# Next.js 15 Auto-Detection Flow:

1. Browser requests /favicon.ico
   → Next.js serves app/favicon.ico

2. Browser requests /apple-touch-icon.png
   → Next.js serves app/apple-icon.png

3. Browser requests /icon?size=32
   → Next.js resizes app/icon.png to 32x32

# Generated HTML in <head>:
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icon?<hash>" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-icon?<hash>" sizes="180x180" />
```

### Sitemap Integration with UNITS Data

```typescript
// Real-time data synchronization:

// app/data/units.ts exports UNITS array
export const UNITS: Unit[] = [
  { slug: 'unit-2528', ... },  // 9 entries total
]

// app/sitemap.ts imports and maps:
import { UNITS } from './data/units'

const propertyPages = UNITS.map((unit) => ({
  url: `https://silverpineapple.net/rooms/${unit.slug}`,
  // ...
}))

// Result: Adding new unit to UNITS array automatically:
// 1. Adds page to sitemap.xml
// 2. Creates metadata for /rooms/[new-slug]
// 3. No manual sitemap updates needed
```

### OpenGraph Image Fallback Strategy

```typescript
// Priority cascade for OG images:

// Priority 1: Unit-specific photo
images: unit.images.length > 0 ? [unit.images[0]] :

// Priority 2: Category default image
  ['/og-rooms.jpg']

// Priority 3: Site-wide default (if og-rooms.jpg missing)
  ['/og-home.jpg']  // Set in layout.tsx

// This ensures EVERY page has an OG image, even with missing data
```

---

## Validation Loop

### Level 1: Syntax & Type Safety

```bash
# Run TypeScript compiler
npm run build

# Expected: Build succeeds
# Common errors:
# - "params is not awaited" → Add: const { slug } = await params
# - "metadataBase is not defined" → Add metadataBase to layout.tsx
# - "Property 'images' does not exist" → Check UNITS type definition

# If build fails, READ the error carefully:
# - Line number tells you exact location
# - Error message explains what's wrong
# - Fix error, rebuild, repeat
```

### Level 2: Metadata Validation

```bash
# 1. Start dev server
npm run dev

# 2. Test homepage metadata
curl -s http://localhost:3000 | grep '<title>'
# Expected: <title>Silver Pineapple | Boutique Short-Term Rentals</title>
# NOT: <title>v0 App</title>

# 3. Test property metadata
curl -s http://localhost:3000/rooms/unit-2528 | grep '<meta property="og:title"'
# Expected: <meta property="og:title" content="Unit 2528 | Silver Pineapple" />

# 4. Test robots.txt
curl http://localhost:3000/robots.txt
# Expected:
# User-agent: *
# Disallow: /test-booking
# Sitemap: https://silverpineapple.net/sitemap.xml

# 5. Test sitemap.xml
curl http://localhost:3000/sitemap.xml
# Expected: 13 <url> entries
# Verify each room slug appears
```

### Level 3: Favicon Verification

```bash
# 1. Check files exist
ls -la app/favicon.ico
ls -la app/icon.png
ls -la app/apple-icon.png

# Expected: All 3 files present

# 2. Test in browser
# Open http://localhost:3000
# Check browser tab - should show Silver Pineapple favicon

# 3. Test on iOS Simulator (if available)
# Safari > Share > Add to Home Screen
# Icon should be Silver Pineapple logo (180x180)

# 4. Verify auto-generated routes
curl -I http://localhost:3000/favicon.ico
# Expected: 200 OK

curl -I http://localhost:3000/apple-touch-icon.png
# Expected: 200 OK (redirects to /apple-icon)
```

### Level 4: OpenGraph Testing

```bash
# CRITICAL: Test with actual social media debuggers

# 1. Facebook Sharing Debugger
# URL: https://developers.facebook.com/tools/debug/
# Input: https://silverpineapple.net/rooms/unit-2528
# Expected:
# - Shows og:title: "Unit 2528 | Silver Pineapple"
# - Shows og:image: 1200x630 image
# - No errors or warnings

# 2. Twitter Card Validator
# URL: https://cards-dev.twitter.com/validator
# Input: https://silverpineapple.net
# Expected:
# - Card preview: "summary_large_image"
# - Shows og-home.jpg
# - Title and description correct

# 3. LinkedIn Post Inspector
# URL: https://www.linkedin.com/post-inspector/
# Input: https://silverpineapple.net/about
# Expected:
# - Shows og-about.jpg
# - No 404 errors for OG image
```

### Level 5: Link Audit

```bash
# 1. Manual footer click test
# - Click every link in footer
# - Should navigate to real page (not # anchor)
# - No 404 errors

# 2. Automated link checking (optional)
npm install -g linkinator

linkinator http://localhost:3000 --recurse --skip "mailto:"
# Expected: All links return 200 OK
# No href="#" found

# 3. Verify social links
# Either:
# - Update with real Instagram/Facebook URLs
# - OR remove social links entirely
# NO broken/placeholder links in production
```

### Level 6: Security & Privacy

```bash
# 1. Check console.log removal
npm run build
npm start

# Visit pages with forms:
# - http://localhost:3000
# - http://localhost:3000/reviews

# Open browser DevTools > Console
# Submit newsletter form
# Expected: NO console.log output (or only in dev mode)

# 2. Verify noindex on test pages
curl -s http://localhost:3000/test-booking | grep 'robots'
# Expected: <meta name="robots" content="noindex, nofollow">

curl -s http://localhost:3000/hospitable-config | grep 'robots'
# Expected: <meta name="robots" content="noindex, nofollow">

# 3. Environment variable check
cat .env.local
# Expected: NEXT_PUBLIC_SITE_URL=https://silverpineapple.net
# NOT: http://localhost:3000
```

---

## Final Validation Checklist

### Pre-Deployment Checklist

- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Homepage Metadata**: Title shows "Silver Pineapple | Boutique...", NOT "v0 App"
- [ ] **All Pages Have Metadata**: Homepage, Rooms, About, Reviews, Search, 8 property pages
- [ ] **Favicons Present**: `/app/favicon.ico`, `/app/icon.png`, `/app/apple-icon.png` exist
- [ ] **Favicons Display**: Browser tab shows Silver Pineapple icon
- [ ] **OpenGraph Images Created**: `/public/og-home.jpg`, `/public/og-about.jpg`, `/public/og-rooms.jpg`
- [ ] **robots.txt Works**: Visit `/robots.txt`, see disallow rules
- [ ] **sitemap.xml Works**: Visit `/sitemap.xml`, see 13 URLs
- [ ] **Footer Links Fixed**: Zero `href="#"` in footer
- [ ] **Console Clean**: No console.log statements with user data
- [ ] **Test Pages Protected**: noindex meta tag on /test-booking and /hospitable-config
- [ ] **.env.local Updated**: NEXT_PUBLIC_SITE_URL=https://silverpineapple.net
- [ ] **.env.example Created**: Template committed to git
- [ ] **package.json Updated**: name = "silver-pineapple-website"

### Post-Deployment Validation (After Cloudflare Deployment)

- [ ] **Facebook Debugger**: Test 3 pages, all show OG images correctly
- [ ] **Twitter Validator**: Homepage shows summary_large_image card
- [ ] **Google Search Console**: Submit sitemap, verify 0 errors
- [ ] **Lighthouse SEO**: Score ≥ 95/100
- [ ] **Mobile Favicon**: Test on iPhone (add to home screen shows logo)
- [ ] **Android PWA**: site.webmanifest loads, icons display
- [ ] **No 404s**: All navigation links work
- [ ] **Analytics Tracking**: Verify NEXT_PUBLIC_ANALYTICS_ID is set correctly

### Success Metrics (30 days post-launch)

- [ ] Google Search Console shows 13 indexed pages
- [ ] Organic search traffic increased by 20%+
- [ ] Social shares increase click-through rate by 10%+
- [ ] Zero support requests about broken links

---

## Anti-Patterns to Avoid

### Metadata Anti-Patterns

```typescript
// ❌ DON'T: Forget metadataBase
export const metadata: Metadata = {
  openGraph: {
    images: ['/og-home.jpg']  // Will fail without metadataBase
  }
}

// ✅ DO: Set metadataBase in layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://silverpineapple.net'),
  openGraph: {
    images: ['/og-home.jpg']  // Now resolves correctly
  }
}

// ❌ DON'T: Use sync params (Next.js 14 pattern)
export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find(u => u.slug === params.slug)  // ERROR in Next.js 15
}

// ✅ DO: Await params (Next.js 15 requirement)
export async function generateMetadata({ params }: Props) {
  const { slug } = await params  // CORRECT
  const unit = UNITS.find(u => u.slug === slug)
}

// ❌ DON'T: Exceed 160 characters in description
description: "Very long description that exceeds 160 characters will be truncated in search results and looks unprofessional when shared on social media platforms like Facebook and Twitter"

// ✅ DO: Keep descriptions concise (50-160 chars)
description: "Boutique rentals in Melbourne FL. Steps from arts district, minutes to beaches."
```

### Favicon Anti-Patterns

```bash
# ❌ DON'T: Put favicon in /public
/public/favicon.ico  # Will be ignored by Next.js 15

# ✅ DO: Put favicon in /app root
/app/favicon.ico  # Automatically detected

# ❌ DON'T: Put favicon in subdirectory
/app/rooms/favicon.ico  # NOT ALLOWED

# ✅ DO: Only in /app root
/app/favicon.ico  # ONLY location that works
```

### Footer Link Anti-Patterns

```typescript
// ❌ DON'T: Leave broken anchor links
<a href="#" className="...">Contact</a>

// ❌ DON'T: Use <a> for internal routes
<a href="/rooms" className="...">Rooms</a>

// ✅ DO: Use Next.js Link for internal routes
import Link from "next/link"
<Link href="/rooms" className="...">Rooms</Link>

// ✅ DO: Remove non-existent pages
// If you don't have a Shop page, DELETE the link entirely
// Don't leave it as href="#"
```

### Console.log Anti-Patterns

```typescript
// ❌ DON'T: Log user data in production
const handleSubmit = (data: FormData) => {
  console.log("Form data:", data)  // Logs email to console = privacy issue
}

// ❌ DON'T: Leave debug logs
console.log("Widget created")  // Clutters production console

// ✅ DO: Remove or wrap in dev check
const handleSubmit = (data: FormData) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Form data:", data)
  }
  // ... actual submit logic
}

// ✅ BEST: Use analytics instead
const handleSubmit = (data: FormData) => {
  // Track event without PII
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'newsletter_signup')
  }
}
```

### OpenGraph Image Anti-Patterns

```typescript
// ❌ DON'T: Use PNG for photos (larger file size)
images: ['/og-home.png']  // 800 KB file

// ✅ DO: Use JPEG for property photos
images: ['/og-home.jpg']  // 120 KB file (same quality)

// ❌ DON'T: Exceed recommended dimensions
images: [{ url: '/og-huge.jpg', width: 2400, height: 1260 }]  // Overkill

// ✅ DO: Use standard 1200x630
images: [{ url: '/og-home.jpg', width: 1200, height: 630 }]  // Perfect

// ❌ DON'T: Forget alt text
images: [{ url: '/og-home.jpg', width: 1200, height: 630 }]

// ✅ DO: Include descriptive alt
images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Silver Pineapple Rentals' }]
```

---

## Additional Context

### Cloudflare Pages Specific Notes

```javascript
// next.config.mjs considerations for Cloudflare:

const nextConfig = {
  // KEEP this for Cloudflare Pages (doesn't support Next.js Image Optimization)
  images: {
    unoptimized: true,
  },

  // OPTIONAL: Enable for production quality
  // eslint: {
  //   ignoreDuringBuilds: false,  // Enforce linting
  // },
  // typescript: {
  //   ignoreBuildErrors: false,    // Enforce type checking
  // },
}
```

### Phased Rollout Strategy

```yaml
# Recommended deployment approach:

# Week 1: Phase 1 (P0 tasks)
- Deploy branding fixes, metadata, robots.txt, sitemap
- Test in staging environment
- Monitor Google Search Console for indexing

# Week 2: Phase 2 (P1 tasks)
- Add security fixes (console.log removal, noindex)
- Create remaining OG images
- Deploy to production

# Week 3: Phase 3 (P2 tasks - optional)
- Fine-tune metadata based on search performance
- Consider creating Privacy/Terms pages
- Evaluate TypeScript strict mode

# Week 4: Monitor & Iterate
- Check Google Search Console weekly
- Review social media sharing analytics
- Gather user feedback on navigation
```

---

**PRP Confidence Score: 9/10**

This PRP provides comprehensive context for one-pass implementation success. The only uncertainty is external tool usage (favicon generation, OG image creation) which requires manual steps but has clear instructions.

**Estimated Total Time:**
- Phase 1 (P0): 3 hours
- Phase 2 (P1): 1.5 hours
- Phase 3 (P2): 1.5 hours (optional)
- **Total: 4.5-6 hours for production readiness**

**Next Steps:**
1. Review this PRP
2. Execute tasks sequentially (Phase 1 → Phase 2 → Phase 3)
3. Validate after each phase using validation checklist
4. Deploy to production when Phase 1 + Phase 2 complete
