# Cloudflare OpenNext Migration - Codebase Analysis

**Project**: Silver Pineapple Short-Term Rental Website  
**Analysis Date**: 2025-10-19  
**Migration**: @cloudflare/next-on-pages → @opennextjs/cloudflare  
**Next.js Version**: 15.2.4  

---

## Executive Summary

This Next.js 15 application is currently **NOT deployed to Cloudflare Pages** and has **NO existing Cloudflare adapter**. The project was originally planned for Vercel deployment (per PLANNING.md and AGENTS.md) but has never been deployed to production.

**Key Finding**: There is only ONE file with edge runtime declaration (`app/manifest.ts`), and the project is otherwise structured as a standard Next.js 15 app with static generation patterns.

**Migration Status**: This is a **greenfield Cloudflare deployment**, not a migration from @cloudflare/next-on-pages.

---

## Current Deployment Configuration

### 1. No Cloudflare Packages Installed

**package.json analysis**:
- No `@cloudflare/next-on-pages` dependency
- No `@opennextjs/cloudflare` dependency  
- No `wrangler` CLI tool
- No `@cloudflare/*` packages

**Current deployment target**: Vercel (planned, per PLANNING.md line 14, 70)

### 2. No Cloudflare Configuration Files

Files checked (all missing):
- ❌ `wrangler.toml` - No Cloudflare Pages configuration
- ❌ `.dev.vars` - No Cloudflare Workers environment variables
- ❌ Any Cloudflare-specific build scripts in package.json

### 3. Build Scripts (Standard Next.js)

```json
"scripts": {
  "build": "next build",
  "dev": "next dev",
  "lint": "next lint",
  "start": "next start"
}
```

**No Cloudflare-specific commands** like:
- `pages:build` 
- `pages:dev`
- `wrangler pages dev`

---

## Architecture Analysis

### 1. Next.js 15 Configuration

**File**: `/next.config.mjs`

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },  // ⚠️ Cloudflare compatibility: already configured
}

export default withNextIntl(nextConfig)
```

**Key observations**:
- ✅ `images.unoptimized: true` - Already compatible with Cloudflare (no Node.js image optimization)
- ✅ Uses `next-intl` plugin for i18n middleware
- ⚠️ No `output: 'export'` (this is correct - OpenNext handles this)
- ⚠️ No edge runtime configuration at config level

### 2. TypeScript Configuration

**File**: `/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": { "@/*": ["./*"] }
  }
}
```

**Compatibility**: ✅ Standard Next.js 15 config, no edge-specific settings needed

---

## i18n Architecture (Critical for OpenNext)

### 1. Middleware Chain

**File**: `/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'  // ⚠️ References _vercel
]
};
```

**Issues for Cloudflare**:
- ⚠️ Matcher excludes `_vercel` paths (should be `_cloudflare` or generic)
- ✅ Uses next-intl middleware (compatible with edge runtime)
- ✅ No server-side Node.js dependencies

### 2. i18n Routing Configuration

**File**: `/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always'  // ✅ Always show locale in URL (/en/ and /es/)
});
```

**Cloudflare compatibility**: ✅ Static configuration, no dynamic imports

### 3. i18n Request Configuration (Critical)

**File**: `/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default  // ⚠️ Dynamic import
  };
});
```

**Cloudflare considerations**:
- ⚠️ Dynamic JSON imports - OpenNext must bundle these statically
- ✅ Async configuration supported by Next.js 15 edge runtime
- 📁 Message files: `/messages/en.json`, `/messages/es.json`

### 4. Locale-Specific Pages

All pages are under `/app/[locale]/` dynamic segment:

```
app/
├── [locale]/
│   ├── layout.tsx          (generateStaticParams for ['en', 'es'])
│   ├── page.tsx            (Home)
│   ├── about/page.tsx
│   ├── rooms/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx (Dynamic room pages)
│   ├── reviews/page.tsx
│   └── search/page.tsx
├── manifest.ts             (edge runtime ⚠️)
├── robots.ts
└── sitemap.ts              (force-static export)
```

---

## Static Generation Patterns

### 1. Pages Using `generateStaticParams()`

**Two files implement static generation**:

#### A. Root Layout (`/app/[locale]/layout.tsx`)

```typescript
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
// Generates: [{ locale: 'en' }, { locale: 'es' }]
```

**Metadata generation**:
```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;  // ✅ Next.js 15 async params pattern
  const t = await getTranslations({ locale, namespace: 'metadata.global' });
  return {
    metadataBase: new URL('https://silverpineapple.net'),
    title: { default: t('defaultTitle'), template: t('titleTemplate') },
    alternates: {
      canonical: `/${locale}`,
      languages: { 'en': '/en', 'es': '/es', 'x-default': '/en' }
    }
  };
}
```

#### B. Room Detail Pages (`/app/[locale]/rooms/[slug]/page.tsx`)

```typescript
export function generateStaticParams() {
  const locales = ['en', 'es'];
  const params = [];

  for (const locale of locales) {
    for (const unit of UNITS) {
      params.push({ locale, slug: unit.slug });
    }
  }

  return params;
}
// Generates: 2 locales × 9 units = 18 static pages
```

**Total static pages**: 18 room detail pages + base locale pages

### 2. Static Export Declarations

**File**: `/app/sitemap.ts`

```typescript
export const dynamic = 'force-static'  // ✅ Ensures static generation
```

**File**: `/app/manifest.ts`

```typescript
export const runtime = 'edge'  // ⚠️ ONLY edge runtime declaration in codebase
```

---

## Edge Runtime vs Node.js Runtime

### Current Runtime Usage

**Edge runtime files**: 1
- `/app/manifest.ts` - PWA manifest (edge runtime declared)

**Node.js runtime files**: All other pages (default)
- All locale pages use Next.js server components (compatible with OpenNext)
- No explicit `runtime = 'nodejs'` declarations

### Client Components (28 files with "use client")

```
app/components/:
- Navbar.tsx
- BookingIframe.tsx
- EauGallieMap.tsx (Leaflet - browser-only)
- All interactive components (forms, buttons, animations)
```

**Cloudflare compatibility**: ✅ Client components run in browser, not edge workers

---

## Static Data Architecture

### 1. Data Files (No Backend API)

```
app/data/
├── units.ts           (9 rental units)
├── categories.ts      (Room category definitions)
├── copy.ts           (Template strings, formatters)
├── reviews.ts        (Static review data)
└── mapMarkers.ts     (Location markers for Leaflet)
```

**All data is imported directly** - no API routes, no database calls.

Example from `/app/data/units.ts`:
```typescript
export interface Unit {
  slug: string
  title: string
  category: CategoryKey
  priceFrom: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  hospitable_id: string  // Third-party booking widget
  images: string[]
}

export const UNITS: Unit[] = [ /* 9 units */ ]
```

### 2. Third-Party Integrations

**Hospitable Booking Widget** (loaded via CDN):
```typescript
// app/[locale]/layout.tsx
<script src="https://hospitable.b-cdn.net/direct-property-search-widget/hospitable-search-widget.prod.js"></script>
```

**Google Analytics** (`app/components/GoogleAnalytics.tsx`):
```typescript
<Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
```

**Leaflet Map** (`app/components/EauGallieMap.tsx`):
- Client-side only ("use client")
- Dynamic imports for SSR compatibility

---

## Environment Variables

### Current Setup

**File**: `.env.example`

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://silverpineapple.net
NEXT_PUBLIC_SITE_NAME="Silver Pineapple"

# Analytics (Google Analytics 4)
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# SEO Verification Tokens (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_VERIFICATION=

# Hospitable Configuration
NEXT_PUBLIC_HOSPITABLE_ACCOUNT_ID=your-hospitable-account-id
NEXT_PUBLIC_HOSPITABLE_WIDGET_URL=your-hospitable-widget-url

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=your-email@domain.com
```

**All variables are `NEXT_PUBLIC_*`** - no server-side secrets, fully compatible with static export.

**For Cloudflare Pages**:
- Set these as **Environment Variables** in Cloudflare Pages dashboard
- No `.env` file deployed (per `.gitignore`)

---

## SEO & Metadata Configuration

### 1. Sitemap Generation (`/app/sitemap.ts`)

```typescript
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://silverpineapple.net'
  
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/rooms`, priority: 0.8 },
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/reviews`, priority: 0.6 },
  ]
  
  const propertyPages = UNITS.map((unit) => ({
    url: `${baseUrl}/rooms/${unit.slug}`,
    priority: 0.9,
  }))
  
  return [...staticPages, ...propertyPages]
}
```

**Issue**: ❌ Sitemap doesn't include locale prefixes (`/en/`, `/es/`)

### 2. Robots.txt (`/app/robots.ts`)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/test-booking', '/hospitable-config', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### 3. PWA Manifest (`/app/manifest.ts`)

```typescript
export const runtime = 'edge'  // ⚠️ Only edge runtime declaration

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Silver Pineapple | Boutique Short-Term Rentals',
    short_name: 'Silver Pineapple',
    start_url: '/',
    display: 'standalone',
    icons: [ /* ... */ ]
  }
}
```

**Issue**: Start URL doesn't respect locale prefix

---

## Public Assets

### Static Files Structure

```
public/
├── Silver_pineapple_logo.png
├── Silver_pineapple_logo_squish.png
├── dolphin.jpeg
├── beach+artsdistrict.jpeg
├── collage-about.png
├── photos_2526/ (8 images)
├── photos_2528/ (10 images)
├── photos_2536/ (8 images)
├── photos_2538/ (12 images)
├── photos_101/ (10 images)
├── photos_102/ (9 images)
├── photos_103/ (8 images)
├── photos_104/ (5 images)
├── photos_seagrape_102/ (13 images)
├── og-home.jpg (OpenGraph placeholder)
├── og-rooms.jpg
├── og-about.jpg
└── icon.png (PWA icon)
```

**Total**: ~100+ images (mostly property photos)

**Cloudflare Pages**: 
- ✅ Supports static files in `/public`
- ⚠️ Watch for 25MB free tier limit per deployment

---

## Custom Styling & Assets

### 1. Global Styles (`/app/globals.css`)

**Key customizations**:
- Coastal gradient utilities (6 custom gradient classes)
- Hospitable widget z-index overrides (z-index: 2147483647 !important)
- Custom animations (fadeIn, shimmer-slide, spin-around)
- Leaflet map customization

**Cloudflare compatibility**: ✅ Pure CSS, no Node.js dependencies

### 2. Tailwind Configuration

**File**: `/tailwind.config.ts` (not shown but referenced)

**Dependencies**:
- `tailwindcss-animate`
- Custom theme colors (tan #D2B48C, primary #1a1a1a)

---

## Build Output Analysis

### Current Build Artifacts (`.next/` directory exists)

```
.next/
├── BUILD_ID
├── app-build-manifest.json
├── app-path-routes-manifest.json
├── build-manifest.json
├── cache/
└── diagnostics/
```

**Observations**:
- Standard Next.js build (not static export)
- No `.vercel/` directory (never deployed)
- No `.cloudflare/` directory

---

## Files Requiring Modification for OpenNext Migration

### Critical Changes

| File | Change Required | Reason |
|------|----------------|--------|
| `package.json` | Add `@opennextjs/cloudflare` dependency | Migration adapter |
| `package.json` | Add build script: `"pages:build": "npx @opennextjs/cloudflare"` | Cloudflare Pages build |
| `wrangler.toml` | **CREATE NEW** | Cloudflare Pages configuration |
| `middleware.ts` | Update matcher to exclude `_cloudflare` instead of `_vercel` | Cloudflare internals |
| `app/sitemap.ts` | Update to include locale prefixes `/en/`, `/es/` | i18n compliance |
| `app/manifest.ts` | Update `start_url` to respect locale | PWA i18n |
| `.gitignore` | Add `.wrangler/`, `wrangler.toml` (optional) | Cloudflare artifacts |

### Optional Enhancements

| File | Enhancement | Benefit |
|------|-------------|---------|
| `app/manifest.ts` | Remove `export const runtime = 'edge'` | Test if unnecessary (OpenNext handles runtime) |
| `next.config.mjs` | Add `experimental: { runtime: 'edge' }` (if needed) | Global edge runtime |
| All pages | Audit and potentially add `export const runtime = 'edge'` | Explicit edge runtime declarations |

---

## Existing Patterns to Maintain

### 1. i18n Patterns (Critical)

**Must preserve**:
- ✅ Locale prefix always shown (`/en/`, `/es/`)
- ✅ `generateStaticParams()` for both locales on all pages
- ✅ Async params pattern (`await params` in Next.js 15)
- ✅ `getTranslations()` from next-intl for all content

**Middleware chain**:
```
Request → next-intl middleware → locale detection → page render
```

### 2. Static Generation Patterns

**Must preserve**:
- ✅ `generateStaticParams()` for locale + slug combinations
- ✅ `generateMetadata()` async pattern for SEO
- ✅ `dynamic = 'force-static'` for sitemap/robots

### 3. SEO Metadata Pattern

**Every page has**:
```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: '...' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/...`,
      languages: { 'en': '/en/...', 'es': '/es/...' }
    },
    openGraph: { /* ... */ },
    twitter: { /* ... */ }
  };
}
```

**OpenNext must support**:
- Async metadata generation
- Dynamic imports of translation JSON files

### 4. Client Component Patterns

**28 client components** use:
- `"use client"` directive
- Browser-only libraries (Leaflet, Framer Motion)
- React hooks (useState, useEffect)

**Pattern to maintain**: Server components by default, client components only when needed.

---

## Dependency Compatibility Analysis

### Next.js 15 Specific Features Used

1. **Async params** (required in Next.js 15):
   ```typescript
   export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
     const { locale } = await params;
   }
   ```

2. **Async searchParams** (required in Next.js 15):
   ```typescript
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
   ```

3. **Force-static exports**:
   ```typescript
   export const dynamic = 'force-static'
   ```

**OpenNext Cloudflare adapter must support Next.js 15 patterns**.

### Third-Party Dependencies (Cloudflare Compatible)

| Package | Version | Cloudflare Compatible | Notes |
|---------|---------|----------------------|-------|
| `next` | 15.2.4 | ✅ | OpenNext adds compatibility layer |
| `next-intl` | 4.3.12 | ✅ | Edge runtime compatible |
| `react` | 19 | ✅ | Browser runtime |
| `framer-motion` | 12.23.12 | ✅ | Client-side only |
| `leaflet` | 1.9.4 | ✅ | Client-side only (dynamic import) |
| `react-hook-form` | 7.54.1 | ✅ | Client-side only |
| `zod` | 3.24.1 | ✅ | Universal validator |
| Radix UI primitives | Various | ✅ | Client-side React components |

**No Node.js-only dependencies detected**.

---

## Known Edge Runtime Incompatibilities

### None Detected

The codebase has:
- ❌ No Node.js filesystem access (no `fs`, `path` modules)
- ❌ No server-side database calls
- ❌ No API routes with Node.js runtime
- ❌ No Node.js crypto/stream APIs

**Architecture is already edge-compatible** (static data + client components).

---

## Recommended OpenNext Migration Strategy

### Phase 1: Setup (Pre-Deployment)

1. **Install OpenNext Cloudflare adapter**:
   ```bash
   npm install --save-dev @opennextjs/cloudflare
   ```

2. **Create `wrangler.toml`**:
   ```toml
   name = "silver-pineapple"
   compatibility_date = "2024-10-01"
   pages_build_output_dir = ".vercel/output/static"
   
   [env.production]
   vars = { NEXT_PUBLIC_SITE_URL = "https://silverpineapple.net" }
   ```

3. **Update package.json scripts**:
   ```json
   "scripts": {
     "build": "next build",
     "pages:build": "npx @opennextjs/cloudflare",
     "pages:dev": "npx wrangler pages dev .vercel/output/static",
     "deploy": "npm run pages:build && npx wrangler pages deploy"
   }
   ```

4. **Update middleware matcher**:
   ```typescript
   export const config = {
     matcher: ['/((?!api|_next|_cloudflare|.*\\..*).*)'
   ]
   };
   ```

### Phase 2: Build & Test

5. **Run OpenNext build**:
   ```bash
   npm run build
   npm run pages:build
   ```

6. **Test locally with Wrangler**:
   ```bash
   npm run pages:dev
   ```

7. **Verify**:
   - [ ] All 18 room pages render correctly (`/en/rooms/*`, `/es/rooms/*`)
   - [ ] i18n middleware redirects properly
   - [ ] Translations load correctly
   - [ ] Hospitable widget embeds work
   - [ ] Leaflet map renders (client-side)
   - [ ] Google Analytics loads

### Phase 3: Cloudflare Pages Deployment

8. **Connect GitHub repo to Cloudflare Pages**:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
   - Node.js version: `18` or `20`

9. **Set environment variables in Cloudflare dashboard**:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_ANALYTICS_ID`
   - All other `NEXT_PUBLIC_*` vars from `.env.example`

10. **Deploy and monitor**:
    - Check build logs for errors
    - Test all pages in production
    - Verify sitemap.xml generates correctly
    - Check robots.txt

### Phase 4: Post-Deployment Fixes

11. **Fix sitemap for i18n**:
    ```typescript
    // app/sitemap.ts
    const locales = ['en', 'es'];
    const pages = [];
    
    for (const locale of locales) {
      pages.push(
        { url: `${baseUrl}/${locale}`, priority: 1.0 },
        { url: `${baseUrl}/${locale}/rooms`, priority: 0.8 },
        // ... etc
      );
    }
    ```

12. **Update manifest start_url**:
    ```typescript
    start_url: '/en',  // Default locale
    ```

13. **Remove edge runtime from manifest** (if build errors occur):
    ```typescript
    // app/manifest.ts
    // export const runtime = 'edge'  // Remove if unnecessary
    ```

---

## Testing Checklist for OpenNext Migration

### Pre-Deployment Testing

- [ ] `npm run build` succeeds without errors
- [ ] `npm run pages:build` generates `.vercel/output/static`
- [ ] `wrangler pages dev` serves site locally
- [ ] All 18 static pages pre-render (`/en/rooms/*`, `/es/rooms/*`)
- [ ] Middleware redirects `/` → `/en` (default locale)
- [ ] Translations load from JSON files
- [ ] Image optimization disabled (already `unoptimized: true`)

### Post-Deployment Testing

- [ ] All pages load correctly on Cloudflare Pages URL
- [ ] i18n routing works (`/en/`, `/es/`)
- [ ] SEO metadata renders (view source)
- [ ] OpenGraph images display correctly
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Google Analytics fires pageviews
- [ ] Hospitable booking widget loads
- [ ] Leaflet map renders on location pages
- [ ] Forms validate with Zod (client-side)
- [ ] Custom gradients render correctly

### Performance Testing

- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse SEO score ≥ 95
- [ ] No console errors in browser
- [ ] Fast page transitions
- [ ] Images load quickly (all static assets)

---

## Risk Assessment

### Low Risk Items ✅

- **Static data architecture**: No database, no API routes
- **Client components**: Browser-only, no edge runtime conflicts
- **Image optimization**: Already disabled (`unoptimized: true`)
- **Environment variables**: All `NEXT_PUBLIC_*` (no server secrets)
- **Third-party scripts**: Loaded via CDN (Hospitable, Google Analytics)

### Medium Risk Items ⚠️

- **next-intl middleware**: Relies on edge runtime; OpenNext must support
- **Dynamic JSON imports**: Translation files must bundle correctly
- **Sitemap generation**: Needs i18n locale prefixes added
- **PWA manifest**: Start URL needs locale awareness

### High Risk Items 🔴

- **None identified** - codebase is already edge-compatible

**Overall Risk**: **LOW** - Architecture is well-suited for Cloudflare Pages.

---

## Open Questions for OpenNext Migration

1. **Does `@opennextjs/cloudflare` support Next.js 15 async params pattern?**
   - All pages use `await params` (required in Next.js 15)

2. **How does OpenNext handle dynamic imports in i18n config?**
   ```typescript
   messages: (await import(`../messages/${locale}.json`)).default
   ```

3. **Should we keep `export const runtime = 'edge'` in manifest.ts?**
   - Is this necessary or will OpenNext auto-detect?

4. **What is the correct `pages_build_output_dir` in wrangler.toml?**
   - `.vercel/output/static` (default) or `.next/`?

5. **Do we need a custom `_routes.json` for i18n middleware?**
   - Or does OpenNext auto-generate this?

---

## Migration Timeline Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Setup** | 1-2 hours | Install adapter, create wrangler.toml, update scripts |
| **Local Testing** | 2-3 hours | Build, test all pages, verify i18n, fix issues |
| **Cloudflare Setup** | 1 hour | Connect repo, configure env vars |
| **First Deploy** | 1 hour | Deploy, monitor build logs |
| **Post-Deploy Fixes** | 2-4 hours | Fix sitemap, manifest, any edge runtime issues |
| **QA & Testing** | 2-3 hours | Full site testing, performance audit |

**Total Estimated Time**: **9-14 hours** (assuming no major blockers)

---

## Conclusion

This Next.js 15 application is **well-positioned for Cloudflare Pages deployment** using `@opennextjs/cloudflare`. The architecture is already edge-compatible with:

- ✅ Static data (no database)
- ✅ Image optimization disabled
- ✅ Client-side only for browser APIs (Leaflet, forms)
- ✅ No Node.js runtime dependencies
- ✅ Environment variables all `NEXT_PUBLIC_*`

**Primary work required**:
1. Install and configure OpenNext adapter
2. Update middleware matcher
3. Fix sitemap to include locale prefixes
4. Test i18n middleware on Cloudflare edge runtime

**No migration from existing Cloudflare setup** - this is a greenfield deployment.

---

## Appendix: File Inventory

### Files to Create

- `wrangler.toml` - Cloudflare Pages configuration
- `.dev.vars` (optional) - Local development env vars

### Files to Modify

1. `package.json` - Add scripts and dependency
2. `middleware.ts` - Update matcher
3. `app/sitemap.ts` - Add locale prefixes
4. `app/manifest.ts` - Update start_url, optionally remove edge runtime
5. `.gitignore` - Add `.wrangler/` and `wrangler.toml`

### Files to Reference (No Changes)

- All pages in `app/[locale]/` - Already using correct patterns
- `i18n/routing.ts` - Static config, no changes needed
- `i18n/request.ts` - OpenNext must support this pattern
- `next.config.mjs` - Already compatible (images.unoptimized)
- All data files (`app/data/*.ts`) - Static, no changes

### Critical Files for OpenNext Support

- `/i18n/request.ts` - Dynamic JSON imports must work
- `/middleware.ts` - Edge middleware must execute correctly
- `/app/[locale]/layout.tsx` - Must generate static params for both locales
- `/app/[locale]/rooms/[slug]/page.tsx` - Must generate 18 static pages

---

**End of Analysis**
