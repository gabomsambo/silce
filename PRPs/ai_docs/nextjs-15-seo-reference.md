# Next.js 15 SEO Reference Guide

**Last Updated:** 2025-10-18
**Target Version:** Next.js 15.2.4 (App Router)

This reference document covers SEO best practices for Next.js 15 App Router, specifically tailored for marketing sites with dynamic property pages (like short-term rental listings).

---

## Table of Contents

1. [Metadata API Overview](#metadata-api-overview)
2. [Static vs Dynamic Metadata](#static-vs-dynamic-metadata)
3. [OpenGraph and Twitter Cards](#opengraph-and-twitter-cards)
4. [Favicon and App Icons](#favicon-and-app-icons)
5. [robots.txt Implementation](#robotstxt-implementation)
6. [sitemap.xml Implementation](#sitemapxml-implementation)
7. [Dynamic Routes and SEO](#dynamic-routes-and-seo)
8. [noindex Meta Tags](#noindex-meta-tags)
9. [Common Pitfalls and Breaking Changes](#common-pitfalls-and-breaking-changes)
10. [Marketing Site Specific Patterns](#marketing-site-specific-patterns)

---

## Metadata API Overview

### Official Documentation

- **Primary Reference:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Metadata Guide:** https://nextjs.org/docs/app/building-your-application/optimizing/metadata

### Key Concepts

Next.js 15 provides two approaches for defining metadata:

1. **Static Metadata:** Export a `Metadata` object from `layout.js` or `page.js`
2. **Dynamic Metadata:** Export a `generateMetadata` function that returns a `Metadata` object

### Important Constraints

- Metadata exports are **only supported in Server Components**
- Cannot export both `metadata` object AND `generateMetadata` function from the same route segment
- File-based metadata (e.g., `opengraph-image.png`) has higher priority than config-based metadata
- `fetch` requests inside `generateMetadata` are automatically memoized

### TypeScript Type Definition

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: string | TemplateString,
  description: string,
  keywords: string | string[],
  authors: Author[],
  creator: string,
  publisher: string,
  robots: RobotsInfo,
  openGraph: OpenGraphInfo,
  twitter: TwitterInfo,
  icons: IconsInfo,
  metadataBase: URL,
  alternates: AlternatesInfo,
  verification: VerificationInfo,
  // ... many more fields
}
```

---

## Static vs Dynamic Metadata

### Static Metadata (Simple Use Case)

Use when metadata doesn't change based on runtime information.

**Example: `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Silver Properties | Luxury Short-Term Rentals',
    template: '%s | Silver Properties',
  },
  description: 'Discover premium short-term rental properties in beautiful coastal locations.',
  keywords: ['vacation rentals', 'short-term rentals', 'luxury properties', 'coastal homes'],
  metadataBase: new URL('https://silverproperties.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Silver Properties',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@silverproperties',
  },
}
```

### Dynamic Metadata (Data-Dependent)

Use `generateMetadata` when metadata depends on:
- Route parameters (e.g., `[slug]`)
- External data (API, database, CMS)
- Parent segment metadata

**Function Signature:**

```typescript
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata>
```

**Parameters:**
- `params`: Dynamic route parameters from root to current segment
- `searchParams`: Current URL search parameters (pages only, not layouts)
- `parent`: Promise resolving to parent segment metadata (for extending)

**Example: `app/rooms/[slug]/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { UNITS } from '@/app/data/units'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // IMPORTANT: In Next.js 15, params is async - must await!
  const { slug } = await params

  const unit = UNITS.find((u) => u.slug === slug)

  if (!unit) {
    return {
      title: 'Property Not Found',
    }
  }

  return {
    title: unit.title,
    description: unit.description,
    keywords: [unit.category, 'vacation rental', unit.location, ...unit.amenities],
    openGraph: {
      title: unit.title,
      description: unit.description,
      images: unit.images.length > 0 ? [
        {
          url: unit.images[0],
          width: 1200,
          height: 630,
          alt: unit.title,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: unit.title,
      description: unit.description,
      images: unit.images.length > 0 ? [unit.images[0]] : [],
    },
  }
}
```

### Extending Parent Metadata

```typescript
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent

  return {
    ...parentMetadata,
    title: 'Child Page Title',
    openGraph: {
      ...parentMetadata.openGraph,
      images: ['/new-image.jpg', ...(parentMetadata.openGraph?.images || [])],
    },
  }
}
```

---

## OpenGraph and Twitter Cards

### Official Documentation

- **OG Image Files:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- **Twitter Image Files:** Similar convention to opengraph-image

### File-Based Approach (Recommended for Static Images)

Next.js automatically generates meta tags when you place image files with special names:

**Supported Formats:**
- `opengraph-image.(jpg|jpeg|png|gif)`
- `twitter-image.(jpg|jpeg|png|gif)`

**Locations:**
- `app/opengraph-image.jpg` → Site-wide default
- `app/rooms/opengraph-image.jpg` → All rooms
- `app/rooms/[slug]/opengraph-image.jpg` → Specific room

**Size Constraints:**
- OpenGraph images: Max 8MB
- Twitter images: Max 5MB

**Recommended Dimensions:**
- 1200 x 630 pixels (works well on Twitter, Facebook, LinkedIn)

**Example File Structure:**

```
app/
├── opengraph-image.png          # Site-wide OG image
├── twitter-image.png             # Site-wide Twitter card
├── rooms/
│   ├── [slug]/
│   │   ├── opengraph-image.tsx  # Dynamic per-property OG image
│   │   └── page.tsx
```

### Config-Based Approach (Flexible)

**Static OG/Twitter Metadata:**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://silverproperties.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://silverproperties.com',
    siteName: 'Silver Properties',
    title: 'Silver Properties | Luxury Rentals',
    description: 'Premium short-term rentals',
    images: [
      {
        url: '/images/og-default.jpg', // Relative to metadataBase
        width: 1200,
        height: 630,
        alt: 'Silver Properties',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@silverproperties',
    creator: '@silverproperties',
    title: 'Silver Properties | Luxury Rentals',
    description: 'Premium short-term rentals',
    images: ['/images/twitter-default.jpg'],
  },
}
```

**Dynamic OG/Twitter Metadata (for property pages):**

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const property = await fetchProperty(slug)

  return {
    openGraph: {
      type: 'website',
      url: `https://silverproperties.com/rooms/${slug}`,
      title: `${property.title} - Silver Properties`,
      description: property.description,
      images: [
        {
          url: property.images[0] || '/images/og-fallback.jpg',
          width: 1200,
          height: 630,
          alt: property.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} - Silver Properties`,
      description: property.description,
      images: [property.images[0] || '/images/twitter-fallback.jpg'],
    },
  }
}
```

### Dynamic OG Image Generation (Code-Based)

For programmatically generated OG images with property data:

**File: `app/rooms/[slug]/opengraph-image.tsx`**

```typescript
import { ImageResponse } from 'next/og'
import { UNITS } from '@/app/data/units'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const unit = UNITS.find((u) => u.slug === params.slug)

  if (!unit) {
    return new ImageResponse(
      <div style={{ fontSize: 128, background: 'white', width: '100%', height: '100%' }}>
        Property Not Found
      </div>,
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom, #d2b48c, #8b7355)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '60px',
        }}
      >
        <div>{unit.title}</div>
        <div style={{ fontSize: 32, marginTop: 20 }}>{unit.category}</div>
      </div>
    ),
    { ...size }
  )
}
```

**Note:** Generated icons are statically optimized (built at build time and cached) unless using Dynamic APIs.

---

## Favicon and App Icons

### Official Documentation

- **App Icons:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

### File Conventions

| File Type | Formats | Location | Purpose |
|-----------|---------|----------|---------|
| `favicon.ico` | `.ico` | `app/` (root only) | Traditional favicon |
| `icon` | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | `app/**/*` | Modern app icons |
| `apple-icon` | `.jpg`, `.jpeg`, `.png` | `app/**/*` | Apple touch icons |

### Important Restrictions

- **favicon.ico can ONLY be in `app/` root** (not subdirectories)
- `icon` and `apple-icon` can be in any route segment
- Cannot generate a `favicon` programmatically (use `icon` instead)

### Static Icon Files

**Simple Setup:**

```
app/
├── favicon.ico          # Traditional favicon (required in root)
├── icon.png             # Modern browsers
├── apple-icon.png       # Apple devices
```

**Generated HTML:**

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icon.png" type="image/png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
```

### Multiple Icons (Size Variants)

Use number suffixes for multiple sizes (sorted lexically):

```
app/
├── icon1.png   # 32x32
├── icon2.png   # 64x64
├── icon3.png   # 128x128
```

### Programmatic Icon Generation

**File: `app/icon.tsx`**

```typescript
import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#d2b48c',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        S
      </div>
    ),
    { ...size }
  )
}
```

### Best Practices

1. Always include `favicon.ico` in `app/` root for browser compatibility
2. Provide `icon.png` (minimum 192x192) for modern browsers
3. Add `apple-icon.png` (180x180) for iOS devices
4. Use SVG icons when possible for scalability (except favicon)
5. Generate icons at build time to avoid runtime overhead

---

## robots.txt Implementation

### Official Documentation

- **robots.txt:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

### Static Approach (Simple Sites)

**File: `app/robots.txt`**

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: https://silverproperties.com/sitemap.xml
```

### Dynamic Approach (Recommended)

**File: `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/', '/private/'],
    },
    sitemap: 'https://silverproperties.com/sitemap.xml',
  }
}
```

### MetadataRoute.Robots Type

```typescript
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }>
  sitemap?: string | string[]
  host?: string
}
```

### Multiple User Agents

Target specific bots with different rules:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/api/',
        crawlDelay: 2,
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://silverproperties.com/sitemap.xml',
  }
}
```

### Caching Behavior

`robots.js` is a **special Route Handler that is cached by default** unless it uses:
- Dynamic APIs (cookies, headers, etc.)
- Dynamic config options

### Common Patterns for Marketing Sites

```typescript
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverproperties.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',           // API routes
        '/_next/',         // Next.js internals (usually auto-blocked anyway)
        '/admin/',         // Admin pages if any
        '/draft/',         // Draft content
        '/private/',       // Private pages
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Best Practices

1. Don't block `/static/` or `/_next/` excessively - may break site functionality
2. Always include sitemap reference
3. Test with Google Search Console's robots.txt Tester
4. Use environment variables for dynamic base URLs
5. Avoid blocking pages unnecessarily (reduces crawl budget waste)

---

## sitemap.xml Implementation

### Official Documentation

- **Sitemap:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- **generateSitemaps:** https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps

### Static Approach (Simple Sites)

**File: `app/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://silverproperties.com</loc>
    <lastmod>2025-10-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://silverproperties.com/rooms</loc>
    <lastmod>2025-10-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Dynamic Approach (Recommended for Property Sites)

**File: `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'
import { UNITS } from '@/app/data/units'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://silverproperties.com'

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
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = UNITS.map((unit) => ({
    url: `${baseUrl}/rooms/${unit.slug}`,
    lastModified: new Date(unit.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticPages, ...propertyPages]
}
```

### MetadataRoute.Sitemap Type

```typescript
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number  // 0.0 to 1.0
  alternates?: {
    languages?: Languages<string>
  }
}>
```

### Large Sitemaps (50,000+ URLs)

Use `generateSitemaps` to split into multiple files:

**File: `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  // Fetch total number of properties
  const totalProperties = 100000
  const itemsPerSitemap = 50000
  const numberOfSitemaps = Math.ceil(totalProperties / itemsPerSitemap)

  return Array.from({ length: numberOfSitemaps }, (_, i) => ({
    id: i,
  }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const end = start + 50000

  const properties = await fetchProperties(start, end)

  return properties.map((property) => ({
    url: `https://silverproperties.com/rooms/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))
}
```

**Accessible at:**
- `/sitemap/0.xml`
- `/sitemap/1.xml`
- `/sitemap/2.xml`
- etc.

### Image Sitemaps

Include property images in sitemap:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return UNITS.map((unit) => ({
    url: `https://silverproperties.com/rooms/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
    images: unit.images.map((img) => ({
      url: img,
      title: unit.title,
      caption: `${unit.title} - ${unit.category}`,
    })),
  }))
}
```

### Localization Support

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://silverproperties.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://silverproperties.com/es',
          fr: 'https://silverproperties.com/fr',
          de: 'https://silverproperties.com/de',
        },
      },
    },
  ]
}
```

### Caching Behavior

**IMPORTANT:** In Next.js 15, `sitemap.js` is **cached by default** BUT:
- In Next.js 14: Generated once and served statically
- In Next.js 15: **Generated on every request** (breaking change!)

To force static generation in Next.js 15:

```typescript
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // ...
}
```

### Best Practices

1. Set appropriate `priority` values (homepage: 1.0, category pages: 0.8, individual listings: 0.9)
2. Use realistic `changeFrequency` (don't use 'always' unless truly necessary)
3. Always use absolute URLs
4. Submit sitemap to Google Search Console and Bing Webmaster Tools
5. Keep sitemaps under 50,000 URLs per file
6. Use environment variables for base URL
7. Include `lastModified` dates when possible

---

## Dynamic Routes and SEO

### Key Change in Next.js 15: Async Params

**BREAKING CHANGE:** In Next.js 15, `params` is now a Promise and must be awaited.

**Old (Next.js 14):**

```typescript
export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find((u) => u.slug === params.slug)  // ❌ Won't work in 15
}
```

**New (Next.js 15):**

```typescript
export async function generateMetadata({ params }: Props) {
  const { slug } = await params  // ✅ Correct
  const unit = UNITS.find((u) => u.slug === slug)
}
```

### Complete Example: Property Detail Page

**File: `app/rooms/[slug]/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { UNITS } from '@/app/data/units'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const unit = UNITS.find((u) => u.slug === slug)

  if (!unit) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverproperties.com'
  const pageUrl = `${baseUrl}/rooms/${slug}`

  return {
    title: `${unit.title} | Silver Properties`,
    description: unit.description || `Book ${unit.title} - ${unit.category} with ${unit.bedrooms} bedrooms, ${unit.bathrooms} bathrooms, sleeps ${unit.sleeps}.`,
    keywords: [
      unit.category,
      'vacation rental',
      unit.location || 'coastal property',
      `${unit.bedrooms} bedroom`,
      'short-term rental',
      ...unit.amenities,
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: `${unit.title} | Silver Properties`,
      description: unit.description || `Book ${unit.title}`,
      siteName: 'Silver Properties',
      images: unit.images.length > 0 ? [
        {
          url: unit.images[0],
          width: 1200,
          height: 630,
          alt: unit.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@silverproperties',
      title: `${unit.title} | Silver Properties`,
      description: unit.description || `Book ${unit.title}`,
      images: unit.images.length > 0 ? [unit.images[0]] : [],
    },
  }
}

// Generate static params for all properties (SSG)
export async function generateStaticParams() {
  return UNITS.map((unit) => ({
    slug: unit.slug,
  }))
}

// Page component
export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const unit = UNITS.find((u) => u.slug === slug)

  if (!unit) {
    notFound()
  }

  return (
    <div>
      <h1>{unit.title}</h1>
      {/* Rest of component */}
    </div>
  )
}
```

### SEO Best Practices for Property Pages

**Title Optimization:**
- Keep titles under 60 characters
- Format: `{Property Name} | {Brand}`
- Include key selling points when space allows

**Description Optimization:**
- Keep descriptions between 50-160 characters
- Front-load important keywords
- Include a clear call-to-action
- Mention unique features (ocean view, hot tub, etc.)

**Example:**

```typescript
description: `Luxury 3BR beachfront villa in ${unit.location}. Sleeps ${unit.sleeps}, ocean views, private pool. Book your coastal escape today!`
```

**Keyword Strategy:**
- Primary: Property type, location, bedrooms
- Secondary: Amenities, nearby attractions, property features
- Long-tail: Specific combinations ("oceanfront 3 bedroom vacation rental Florida")

**Canonical URLs:**
- Always set canonical to avoid duplicate content issues
- Use absolute URLs with protocol (https://)

**Structured Data (Future Enhancement):**

Consider adding JSON-LD for `LodgingBusiness` or `Apartment` schema:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: unit.title,
  description: unit.description,
  image: unit.images,
  address: {
    '@type': 'PostalAddress',
    addressLocality: unit.location,
  },
  numberOfRooms: unit.bedrooms,
}
```

---

## noindex Meta Tags

### Use Cases

Prevent search engines from indexing certain pages:
- Admin pages
- User dashboards
- Checkout/payment pages
- Draft content
- Internal search result pages
- Pagination pages (use canonical instead)
- Thank you/confirmation pages

### Implementation via Metadata

**Example: `app/admin/page.tsx`**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nosnippet: true,
    noarchive: true,
    nocache: true,
    noimageindex: true,
    nositelinkssearchbox: true,
  },
}
```

**Generated HTML:**

```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache, nositelinkssearchbox">
```

### Robots Type Definition

```typescript
type Robots = {
  index?: boolean
  follow?: boolean
  noarchive?: boolean
  nosnippet?: boolean
  noimageindex?: boolean
  nocache?: boolean
  notranslate?: boolean
  nositelinkssearchbox?: boolean
  unavailable_after?: string
  maxImagePreview?: 'none' | 'standard' | 'large'
  maxSnippet?: number
  maxVideoPreview?: number
  googleBot?: RobotsInfo  // Same structure as above
}
```

### Google-Specific Bot Targeting

```typescript
export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

### Dynamic noindex Based on Conditions

**Example: Draft content or unpublished properties**

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const property = await fetchProperty(slug)

  const shouldIndex = property.status === 'published'

  return {
    title: property.title,
    description: property.description,
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
    },
  }
}
```

### Common Issue: Unintended noindex

**Problem:** Some developers report unintended `noindex` appearing on pages.

**Common Causes:**
1. Using `useSearchParams()` in a component (causes dynamic rendering)
2. Missing metadata export (Next.js may add default noindex)
3. Development environment (some tools add noindex in dev)

**Solution:**

Always explicitly set robots metadata:

```typescript
export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
}
```

---

## Common Pitfalls and Breaking Changes

### 1. Async Params (Next.js 15 Breaking Change)

**Issue:** `params` is now a Promise

**Fix:**

```typescript
// Before (Next.js 14)
export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find((u) => u.slug === params.slug)  // ❌
}

// After (Next.js 15)
export async function generateMetadata({ params }: Props) {
  const { slug } = await params  // ✅
  const unit = UNITS.find((u) => u.slug === slug)
}
```

### 2. Missing metadataBase

**Issue:** Using relative URLs in metadata without `metadataBase` causes build errors.

**Error Message:**

```
Error: metadata.openGraph.images must use absolute URLs
```

**Fix:**

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://silverproperties.com'),
  openGraph: {
    images: '/og-image.jpg',  // Now resolves to absolute URL
  },
}
```

### 3. Sitemap Caching Change (Next.js 15)

**Issue:** Sitemaps are now dynamic by default (generated on every request).

**Impact:** Performance overhead for large sitemaps.

**Fix:**

```typescript
// Force static generation
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // ...
}
```

### 4. Metadata Streaming Issues (Next.js 15.1+)

**Issue:** In some Next.js 15.1+ versions, metadata can render in `<body>` instead of `<head>` during client-side navigation.

**Impact:** Breaks SEO as search engines don't wait for hydration.

**Temporary Fixes:**
- Pin to Next.js 15.0.x if experiencing this
- Test social media card previews thoroughly
- Use static metadata when possible
- Monitor Vercel GitHub issues for official fix

**Related Issues:**
- https://github.com/vercel/next.js/issues/58615
- https://github.com/vercel/next.js/discussions/72013

### 5. File-Based vs Config-Based Priority

**Issue:** File-based metadata (e.g., `opengraph-image.png`) overrides config-based metadata.

**Solution:** Be intentional about which approach you use per route segment.

```
app/
├── layout.tsx                  # metadata: { openGraph: {...} }
├── opengraph-image.png         # This takes precedence!
```

### 6. Icon File Location Restrictions

**Issue:** `favicon.ico` can ONLY be in `app/` root.

**Fix:** For route-specific favicons, use `icon.png` instead.

### 7. React 19 Requirement

Next.js 15 requires React 19, which may have breaking changes for some dependencies.

### 8. Automatic noindex in Development

Some Next.js configurations add `noindex` in development mode. Always verify production builds.

**Check:**

```bash
npm run build
npm start
# View page source and verify <meta name="robots"> tags
```

---

## Marketing Site Specific Patterns

### Root Layout SEO Setup

**File: `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverproperties.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Silver Properties | Luxury Short-Term Rentals',
    template: '%s | Silver Properties',
  },
  description: 'Discover premium short-term rental properties in beautiful coastal locations. Book your perfect vacation home today.',
  keywords: [
    'vacation rentals',
    'short-term rentals',
    'luxury properties',
    'coastal homes',
    'beach rentals',
    'family vacation homes',
  ],
  authors: [{ name: 'Silver Properties' }],
  creator: 'Silver Properties',
  publisher: 'Silver Properties',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Silver Properties',
    title: 'Silver Properties | Luxury Short-Term Rentals',
    description: 'Discover premium short-term rental properties in beautiful coastal locations.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Silver Properties - Luxury Rentals',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@silverproperties',
    creator: '@silverproperties',
    title: 'Silver Properties | Luxury Short-Term Rentals',
    description: 'Discover premium short-term rental properties in beautiful coastal locations.',
    images: ['/images/twitter-default.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Homepage Metadata Override

**File: `app/page.tsx`**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',  // Uses template from layout → "Home | Silver Properties"
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <div>Welcome</div>
}
```

### Property Listing Page

**File: `app/rooms/page.tsx`**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Properties',
  description: 'Browse our collection of luxury vacation rentals. Find the perfect property for your next getaway with stunning ocean views, modern amenities, and coastal charm.',
  alternates: {
    canonical: '/rooms',
  },
}
```

### Complete Property Detail SEO

**File: `app/rooms/[slug]/page.tsx`**

See [Dynamic Routes and SEO](#dynamic-routes-and-seo) section above for complete example.

### Contact Page (Lower Priority)

**File: `app/contact/page.tsx`**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Silver Properties. We\'re here to help you find your perfect vacation rental.',
  robots: {
    index: true,  // Allow indexing
    follow: true,
  },
  alternates: {
    canonical: '/contact',
  },
}
```

### 404 Page

**File: `app/not-found.tsx`**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  robots: {
    index: false,  // Don't index 404 pages
    follow: false,
  },
}

export default function NotFound() {
  return <div>Page not found</div>
}
```

### Complete Sitemap for Marketing Site

**File: `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'
import { UNITS } from '@/app/data/units'

export const dynamic = 'force-static'  // Static generation in Next.js 15

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverproperties.com'
  const currentDate = new Date()

  // Static marketing pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Dynamic property pages (high priority for conversions)
  const propertyPages: MetadataRoute.Sitemap = UNITS.map((unit) => ({
    url: `${baseUrl}/rooms/${unit.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,  // High priority - these are money pages
  }))

  return [...staticPages, ...propertyPages]
}
```

### robots.txt for Marketing Site

**File: `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverproperties.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',      // Block API routes
        '/_next/',    // Next.js internals (auto-blocked anyway)
        '/admin/',    // Admin area if exists
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Environment Variables Setup

**File: `.env.example`**

```bash
# SEO & Site Configuration
NEXT_PUBLIC_SITE_URL=https://silverproperties.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@silverproperties
NEXT_PUBLIC_FACEBOOK_PAGE=https://facebook.com/silverproperties

# Verification Codes
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

**File: `.env.local`** (for local development)

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Additional Resources

### Official Next.js Documentation

- **Metadata API:** https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **generateMetadata:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **File Conventions:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata
- **OpenGraph Images:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- **App Icons:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
- **robots.txt:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- **sitemap.xml:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- **Next.js 15 Release:** https://nextjs.org/blog/next-15

### SEO Testing Tools

- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster Tools:** https://www.bing.com/webmasters
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
- **Schema Markup Validator:** https://validator.schema.org/

### Community Resources

- **Next.js 15 SEO Comprehensive Checklist:** https://dev.to/simplr_sh/nextjs-15-app-router-seo-comprehensive-checklist-3d3f
- **Ultimate Next.js Metadata Guide (2025):** https://www.boar.is/p/nextjs-metadata
- **Practical SEO in Next.js App Router:** https://dev.to/cre8stevedev/practical-guide-to-implementing-functional-seo-in-nextjs-app-router-static-dynamic-metadata-4ae2

---

## Quick Reference Checklist

### Pre-Launch SEO Checklist

- [ ] `metadataBase` set in root layout
- [ ] Site-wide metadata in `app/layout.tsx`
- [ ] Page-specific metadata for all routes
- [ ] Dynamic metadata for `[slug]` routes
- [ ] OpenGraph images (1200x630)
- [ ] Twitter card images
- [ ] `favicon.ico` in `app/` root
- [ ] `icon.png` (192x192+)
- [ ] `apple-icon.png` (180x180)
- [ ] `robots.txt` or `robots.ts`
- [ ] `sitemap.xml` or `sitemap.ts`
- [ ] Canonical URLs on all pages
- [ ] No unintended `noindex` tags
- [ ] All images have alt text
- [ ] Titles under 60 characters
- [ ] Descriptions 50-160 characters
- [ ] Environment variables configured
- [ ] Google Search Console setup
- [ ] Bing Webmaster Tools setup
- [ ] Social media card previews tested
- [ ] Mobile-friendly test passed
- [ ] Core Web Vitals passing

---

**End of Document**
