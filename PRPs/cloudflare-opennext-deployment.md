# Deploy Silver Pineapple to Cloudflare Pages with OpenNext Adapter

**Feature**: Production deployment to Cloudflare Pages using @opennextjs/cloudflare
**Type**: Greenfield Deployment (NOT a migration)
**Priority**: High
**Estimated Time**: 6-10 hours
**Risk Level**: LOW

---

## Goal

Deploy the Silver Pineapple Next.js 15 rental website to Cloudflare Pages using the modern @opennextjs/cloudflare adapter, preserving all existing functionality including static generation, i18n (English/Spanish), SEO metadata, and the Hospitable booking widget integration.

### Feature Goal
Enable production hosting on Cloudflare Pages infrastructure while maintaining:
- All 30+ statically generated pages (including 18 room detail pages)
- Full next-intl i18n support (`/en/*` and `/es/*` routes)
- SEO optimization (sitemaps, metadata, robots.txt)
- Hospitable booking widget functionality
- Google Analytics tracking

### Deliverable
- Fully functional Cloudflare Pages deployment accessible via custom domain
- All pages load correctly with proper i18n routing
- Static generation preserved for SEO benefits
- Local development environment with Cloudflare bindings support
- Deployment pipeline via GitHub → Cloudflare Pages

### Success Definition
- ✅ `npm run build` completes successfully
- ✅ `npm run preview` runs locally in Workers runtime
- ✅ All 18 room pages render with correct Spanish/English translations
- ✅ i18n language switching works (`/en/*` ↔ `/es/*`)
- ✅ Sitemaps include locale prefixes
- ✅ Production deployment succeeds via Cloudflare Pages
- ✅ Google Analytics tracks page views
- ✅ Hospitable booking widget loads and functions

---

## Why

### Business Value
- **Cost Efficiency**: Cloudflare Pages free tier supports commercial use for small businesses
- **Performance**: CDN edge deployment with low latency globally
- **Scalability**: Handles traffic spikes without additional configuration
- **Synergy**: Leverages existing Cloudflare infrastructure (DNS, CDN, etc.)

### User Impact
- Faster page load times via edge deployment
- Improved SEO through proper static generation
- Better user experience with i18n support
- Reliable booking widget integration

### Problems This Solves
- **Current State**: No production deployment exists
- **Solution**: Production-ready hosting on Cloudflare Pages
- **Benefits**: Professional hosting for rental property marketing site

---

## What

### User-Visible Behavior
1. Website accessible at `https://silverpineapple.net` (or configured domain)
2. English and Spanish versions available via `/en/*` and `/es/*` routes
3. All room listings display with proper pricing, images, and booking widgets
4. Language toggle switches between English and Spanish
5. Google Analytics tracks visitor behavior
6. Booking widgets connect to Hospitable platform

### Technical Requirements
- Next.js 15.2.4 with App Router
- Static Site Generation (SSG) for all pages
- next-intl middleware for i18n routing
- Node.js runtime (NOT Edge runtime)
- Cloudflare Workers with nodejs_compat flag
- Dynamic JSON imports for translation files
- Client-side interactivity for 28 React components

### Success Criteria
- [ ] All pages accessible via HTTPS with custom domain
- [ ] Sitemap includes both English (`/en/*`) and Spanish (`/es/*`) URLs
- [ ] Metadata (Open Graph, Twitter) renders correctly per locale
- [ ] Room detail pages show correct pricing and availability
- [ ] Newsletter signup form works
- [ ] Review submission form works
- [ ] Mobile-responsive design renders correctly
- [ ] Page load time < 2 seconds (measured via Lighthouse)
- [ ] No console errors in browser developer tools
- [ ] Analytics tracking ID fires correctly

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Critical documentation for implementation

- docfile: PRPs/ai_docs/opennext-cloudflare-setup.md
  why: Complete setup guide for @opennextjs/cloudflare adapter (23KB, 1041 lines)
  critical: |
    - Installation steps with package.json scripts
    - wrangler.toml configuration template
    - nodejs_compat flag requirement
    - compatibility_date minimum (2024-09-23)
    - Build process and deployment commands
    - Troubleshooting common issues

- docfile: PRPs/ai_docs/nextintl-opennext-compatibility.md
  why: next-intl middleware compatibility research and configuration
  critical: |
    - CONFIRMED: next-intl works with OpenNext Cloudflare
    - Must use Node.js runtime (NOT Edge runtime)
    - Middleware chaining patterns
    - Dynamic JSON import bundling
    - Working example references

- docfile: PRPs/planning/cloudflare-opennext-migration-analysis.md
  why: Comprehensive codebase analysis (24KB) identifying all files to modify
  critical: |
    - Current architecture (greenfield, not migration)
    - i18n setup (middleware, routing, message loading)
    - Static generation patterns (generateStaticParams usage)
    - 5 files requiring modification
    - 18 room pages with 2 locales each

- url: https://opennext.js.org/cloudflare/get-started
  why: Official OpenNext Cloudflare getting started guide
  sections: Installation, Configuration, Build & Deployment

- url: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
  why: Cloudflare Workers Next.js framework guide
  sections: Compatibility flags, Environment setup, Deployment

- url: https://next-intl.dev/docs/getting-started
  why: next-intl official documentation
  sections: Middleware setup, Routing configuration, Message loading

- file: /next.config.mjs
  why: Current Next.js configuration with next-intl plugin
  pattern: |
    - Already uses next-intl plugin
    - Images already unoptimized (Cloudflare compatible)
    - ESLint and TypeScript errors ignored in build

- file: /middleware.ts
  why: Current next-intl middleware implementation
  pattern: |
    - Uses createMiddleware from next-intl
    - Matcher currently excludes `_vercel` (needs update)
    - No auth middleware (simple chain)

- file: /i18n/routing.ts
  why: Locale configuration (static, no dynamic imports)
  pattern: |
    - Locales: ['en', 'es']
    - defaultLocale: 'en'
    - localePrefix: 'always'

- file: /i18n/request.ts
  why: Message loading with dynamic imports (CRITICAL)
  pattern: |
    - Dynamic import: `await import(\`../messages/${locale}.json\`)
    - Must be bundled correctly by OpenNext
    - Returns locale and messages object

- file: /app/[locale]/layout.tsx
  why: Root layout with generateStaticParams for locales
  pattern: |
    - generateStaticParams(): Returns [{ locale: 'en' }, { locale: 'es' }]
    - async params pattern (Next.js 15 requirement)
    - getTranslations for metadata

- file: /app/[locale]/rooms/[slug]/page.tsx
  why: Dynamic room pages with generateStaticParams
  pattern: |
    - Generates 18 pages (9 units × 2 locales)
    - async params: { locale, slug }
    - Static metadata with translations

- file: /app/data/units.ts
  why: Static data (9 rental units)
  pattern: |
    - UNITS array with slug, title, pricing, images
    - No database queries
    - Imported directly in pages

- file: /app/sitemap.ts
  why: SEO sitemap (needs locale prefix update)
  pattern: |
    - Currently exports routes without locale prefixes
    - Needs update to include /en/* and /es/* URLs
    - export const dynamic = 'force-static'
```

### Current Codebase Structure
```bash
silce/
├── app/
│   ├── [locale]/              # i18n route group
│   │   ├── layout.tsx         # Root layout with generateStaticParams
│   │   ├── page.tsx           # Home page
│   │   ├── about/page.tsx
│   │   ├── rooms/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx  # 18 static pages (9 units × 2 locales)
│   │   ├── reviews/page.tsx
│   │   └── search/page.tsx
│   ├── components/            # 28 client components ("use client")
│   ├── data/                  # Static TypeScript data
│   │   ├── units.ts           # 9 rental properties
│   │   ├── categories.ts
│   │   └── reviews.ts
│   ├── manifest.ts            # PWA manifest (has edge runtime)
│   ├── robots.ts
│   └── sitemap.ts            # SEO sitemap
├── i18n/
│   ├── routing.ts            # Locale config
│   └── request.ts            # Message loading (dynamic imports!)
├── messages/
│   ├── en.json               # English translations
│   └── es.json               # Spanish translations
├── middleware.ts             # next-intl middleware
├── next.config.mjs          # Next.js + next-intl plugin
├── package.json
└── tsconfig.json
```

### Desired Codebase Structure (After Deployment Setup)
```bash
silce/
├── .worker-next/            # ← OpenNext build output (gitignored)
│   ├── index.mjs            # Workers entry point
│   ├── assets/              # Static files
│   └── ...
├── wrangler.toml            # ← CREATE: Cloudflare config
├── .dev.vars                # ← OPTIONAL: Local env vars
├── cloudflare-env.d.ts      # ← GENERATED: TypeScript types
├── open-next.config.ts      # ← AUTO-GENERATED: OpenNext config
└── ... (all existing files)
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL #1: Runtime Configuration
// ❌ DO NOT USE Edge Runtime
export const runtime = 'edge';  // This BREAKS OpenNext Cloudflare

// ✅ USE Node.js runtime (default)
// Simply omit runtime export in all page files
// OpenNext adapter ONLY supports Node.js runtime, NOT Edge

// EXCEPTION: app/manifest.ts currently has edge runtime
// Decision needed: Keep for PWA or remove for consistency


// CRITICAL #2: wrangler.toml Requirements
// These settings are MANDATORY (build will fail without them):
compatibility_date = "2024-09-23"  // Minimum required
compatibility_flags = ["nodejs_compat"]  // REQUIRED for Node.js APIs


// CRITICAL #3: Middleware Matcher Pattern
// Current: matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
// Problem: References Vercel-specific `_vercel` directory
// Fix: Remove _vercel reference or make generic
matcher: ['/((?!api|_next|_static|_cloudflare|.*\\..*).*)']


// CRITICAL #4: Dynamic JSON Imports (i18n Messages)
// File: i18n/request.ts
messages: (await import(`../messages/${locale}.json`)).default
// OpenNext MUST bundle these at build time
// Test thoroughly: Verify translations load in preview mode


// CRITICAL #5: Static Generation with i18n
// generateStaticParams() creates:
// - 2 locale pages: /en and /es
// - 18 room pages: /en/rooms/{slug} and /es/rooms/{slug}
// Total: ~30+ pre-rendered pages
// These MUST remain static for SEO (not dynamic rendering)


// CRITICAL #6: Build Output Directory
// OpenNext generates: .worker-next/
// Vercel generates: .vercel/
// Add to .gitignore:
.worker-next/
wrangler.toml  # Only if it contains secrets


// CRITICAL #7: Environment Variables
// All current env vars are NEXT_PUBLIC_* (client-side)
// Cloudflare: Set in wrangler.toml [vars] section OR Cloudflare dashboard
// NO secrets in wrangler.toml (use Cloudflare dashboard for secrets)


// CRITICAL #8: next.config.mjs Plugin Order
// Current: next-intl plugin wraps config
// Must add: initOpenNextCloudflareForDev() AFTER export
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
export default withNextIntl(nextConfig);
initOpenNextCloudflareForDev();  // Must be AFTER export


// CRITICAL #9: Package.json Scripts
// Standard Next.js scripts:
"build": "next build"  // Keep this
// Add OpenNext scripts:
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"


// CRITICAL #10: Sitemap Locale Prefixes
// Current sitemap.ts outputs routes without locale prefixes
// Problem: SEO requires /en/* and /es/* URLs in sitemap
// Fix: Update sitemap generation to include locale prefixes
urls.push({ url: `https://silverpineapple.net/en/${slug}` })
urls.push({ url: `https://silverpineapple.net/es/${slug}` })


// GOTCHA #11: First Deployment Auth
// First time: wrangler login (opens browser)
// Subsequent: Uses stored credentials
// CI/CD: Use CLOUDFLARE_API_TOKEN environment variable


// GOTCHA #12: Build Time on Cloudflare Pages
// Large projects may timeout (default: 15 minutes)
// Monitor first build closely
// This project: Small, should complete in 2-5 minutes
```

---

## Implementation Blueprint

### Data Models & Structure

No new data models required. This deployment uses existing static data:

```typescript
// app/data/units.ts - Existing static data (no changes)
export const UNITS: Unit[] = [
  {
    slug: "unit-2528",
    title: "Cozy Studio Near Arts District",
    category: "studio",
    priceFrom: 89,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    images: [...],
    hospitable_id: "..."
  },
  // ... 8 more units
];

// messages/en.json - Existing translations (no changes)
{
  "navbar": { "home": "Home", "rooms": "Rooms", ... },
  "rooms": { ... },
  "about": { ... }
}

// i18n/routing.ts - Existing locale config (no changes)
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
```

### Implementation Tasks (Ordered by Dependency)

```yaml
Task 1: Install Dependencies
  COMMAND: |
    cd /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce
    npm install @opennextjs/cloudflare@latest
    npm install --save-dev wrangler@latest

  VERIFY: |
    package.json includes:
    - "@opennextjs/cloudflare": "^1.x.x" in dependencies
    - "wrangler": "^3.x.x" in devDependencies

  EXPECTED_OUTPUT: |
    added 2 packages, and audited 303 packages in 10s

  CRITICAL: Run from project root, not parent directory


Task 2: Update package.json Scripts
  MODIFY: package.json

  FIND_SECTION: |
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    }

  REPLACE_WITH: |
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "pages:build": "opennextjs-cloudflare build",
      "pages:dev": "npm run pages:build && wrangler pages dev .worker-next --compatibility-date=2024-09-23 --compatibility-flag=nodejs_compat",
      "preview": "npm run pages:build && opennextjs-cloudflare preview",
      "deploy": "npm run pages:build && wrangler pages deploy .worker-next",
      "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
    }

  WHY: |
    - pages:build: Build Next.js app for Cloudflare Workers
    - pages:dev: Local development in Workers runtime
    - preview: Quick local preview (combines build + preview)
    - deploy: Deploy to Cloudflare Pages
    - cf-typegen: Generate TypeScript types for bindings


Task 3: Create wrangler.toml Configuration
  CREATE: wrangler.toml

  CONTENT: |
    name = "silver-pineapple"
    compatibility_date = "2024-09-23"
    compatibility_flags = ["nodejs_compat"]

    pages_build_output_dir = ".worker-next"

    # Assets binding (required for static files)
    [[assets]]
    binding = "ASSETS"

    # Environment variables (client-side only, no secrets)
    [vars]
    NEXT_PUBLIC_SITE_URL = "https://silverpineapple.net"

    # Note: For secrets (like API keys), use Cloudflare dashboard:
    # Settings > Environment Variables > Production

  LOCATION: Project root (same level as package.json)

  CRITICAL: |
    - compatibility_date MUST be >= 2024-09-23
    - nodejs_compat flag is REQUIRED (build fails without it)
    - pages_build_output_dir must match OpenNext output (.worker-next)
    - NO secrets in this file (use Cloudflare dashboard)


Task 4: Update next.config.mjs
  MODIFY: next.config.mjs

  CURRENT_CODE: |
    import createNextIntlPlugin from 'next-intl/plugin';

    const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

    const nextConfig = {
      eslint: { ignoreDuringBuilds: true },
      typescript: { ignoreBuildErrors: true },
      images: { unoptimized: true },
    }

    export default withNextIntl(nextConfig)

  ADD_AFTER_EXPORT: |
    // Enable Cloudflare bindings in local development
    import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
    initOpenNextCloudflareForDev();

  FINAL_CODE: |
    import createNextIntlPlugin from 'next-intl/plugin';

    const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

    const nextConfig = {
      eslint: { ignoreDuringBuilds: true },
      typescript: { ignoreBuildErrors: true },
      images: { unoptimized: true },
    }

    export default withNextIntl(nextConfig)

    // Enable Cloudflare bindings in local development
    import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
    initOpenNextCloudflareForDev();

  WHY: Enables access to Cloudflare bindings during `next dev`

  CRITICAL: Import MUST be after export (ESM module loading order)


Task 5: Update Middleware Matcher
  MODIFY: middleware.ts

  FIND_LINE: |
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']

  REPLACE_WITH: |
    matcher: ['/((?!api|_next|_static|.*\\..*).*)']

  WHY: |
    - Remove Vercel-specific `_vercel` reference
    - Add `_static` to exclude static file directory
    - More generic pattern works on any platform

  VERIFY: Middleware still excludes API routes and static files


Task 6: Update .gitignore
  MODIFY: .gitignore

  ADD_LINES: |
    # Cloudflare
    .worker-next/
    .wrangler/
    .dev.vars
    cloudflare-env.d.ts

  WHY: |
    - .worker-next/: OpenNext build output (regenerated on each build)
    - .wrangler/: Wrangler CLI cache
    - .dev.vars: Local environment variables (may contain secrets)
    - cloudflare-env.d.ts: Auto-generated TypeScript types

  LOCATION: Append to existing .gitignore


Task 7: Update Sitemap for i18n
  MODIFY: app/sitemap.ts

  CURRENT_PATTERN: |
    // Currently outputs routes without locale prefixes
    urls.push({ url: `https://silverpineapple.net/rooms/${unit.slug}` })

  UPDATE_TO: |
    // Add both English and Spanish URLs
    const locales = ['en', 'es'];
    locales.forEach(locale => {
      urls.push({
        url: `https://silverpineapple.net/${locale}/rooms/${unit.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });

  APPLY_TO_ALL_ROUTES: |
    - Home: /en and /es
    - About: /en/about and /es/about
    - Rooms: /en/rooms and /es/rooms
    - Each room: /en/rooms/{slug} and /es/rooms/{slug}
    - Reviews: /en/reviews and /es/reviews

  WHY: SEO requires locale-specific URLs in sitemap

  CRITICAL: Affects SEO - Google needs explicit locale URLs


Task 8: First Local Build Test
  COMMAND: npm run pages:build

  EXPECTED_OUTPUT: |
    > opennextjs-cloudflare build

    Building Next.js application...
    ✓ Compiled successfully
    ✓ Generating static pages (33/33)
    ✓ Finalizing page optimization

    Creating Cloudflare Workers bundle...
    ✓ Worker bundle created at .worker-next/index.mjs
    ✓ Static assets copied to .worker-next/assets

    Build complete!

  VERIFY: |
    - .worker-next/ directory created
    - .worker-next/index.mjs exists (Workers entry point)
    - .worker-next/assets/ contains static files
    - No errors about missing modules or imports

  IF_ERRORS: |
    - "nodejs_compat not enabled": Add to wrangler.toml compatibility_flags
    - "Dynamic import failed": Check i18n/request.ts message loading
    - "Module not found": Check package.json dependencies

  CRITICAL: This step validates the build works before deployment


Task 9: Local Preview Test
  COMMAND: npm run pages:dev

  EXPECTED_OUTPUT: |
    ⎔ Starting local server...
    [wrangler] Ready on http://localhost:8788

  MANUAL_TESTS: |
    1. Visit http://localhost:8788/en
       - Home page loads
       - Navigation works
       - Footer renders

    2. Visit http://localhost:8788/es
       - Spanish translations load
       - Content shows in Spanish

    3. Visit http://localhost:8788/en/rooms/unit-2528
       - Room detail page renders
       - Images display
       - Booking widget loads (from Hospitable CDN)

    4. Click language toggle
       - URL changes from /en/* to /es/* (or vice versa)
       - Content switches language

    5. Check browser console
       - No errors
       - Analytics script loads (if configured)

  IF_ERRORS: |
    - "Translation missing": Check messages/ JSON files
    - "404 on routes": Verify middleware matcher pattern
    - "Widget not loading": Check if Hospitable script in layout.tsx

  CRITICAL: Validates full application works locally before cloud deployment


Task 10: Configure Cloudflare Pages Project
  PLATFORM: Cloudflare Dashboard

  STEPS: |
    1. Log in to Cloudflare Dashboard (dash.cloudflare.com)

    2. Navigate to Workers & Pages > Create application > Pages > Connect to Git

    3. Authorize GitHub access and select repository:
       - Repository: gabomsambo/silce (or your GitHub repo)

    4. Configure build settings:
       - Framework preset: None (we handle build with npm scripts)
       - Build command: npm run pages:build
       - Build output directory: .worker-next
       - Root directory: (leave empty or set to silce/ if monorepo)

    5. Environment variables (if any):
       - NEXT_PUBLIC_SITE_URL: https://silverpineapple.net
       - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: (from .env.local if exists)
       - NEXT_PUBLIC_ANALYTICS_ID: (Google Analytics ID)

    6. Advanced settings:
       - Node.js version: 18 or 20
       - Compatibility date: 2024-09-23 (matches wrangler.toml)
       - Compatibility flags: nodejs_compat

    7. Save and deploy

  FIRST_DEPLOYMENT: |
    - Cloudflare will clone repo
    - Run npm install
    - Run npm run pages:build
    - Deploy .worker-next to Cloudflare Workers
    - Assign temporary URL: https://silver-pineapple-xxx.pages.dev

  VERIFY: |
    - Build completes without errors
    - Deployment succeeds
    - Preview URL is accessible

  CUSTOM_DOMAIN: |
    - After first successful deployment
    - Pages > Custom domains > Set up a custom domain
    - Add silverpineapple.net
    - Follow DNS configuration steps (CNAME or A record)


Task 11: Post-Deployment Validation
  MANUAL_TESTS: |
    1. Visit production URL (https://silver-pineapple-xxx.pages.dev)
       ✓ Home page loads
       ✓ Styles render correctly
       ✓ Images display

    2. Test language switching
       ✓ /en → /es transition works
       ✓ Translations display correctly
       ✓ URL updates properly

    3. Test all room pages (sample)
       ✓ /en/rooms/unit-2528 loads
       ✓ /es/rooms/unit-2528 loads
       ✓ Pricing displays correctly
       ✓ Booking widget iframe loads

    4. Test navigation
       ✓ All nav links work
       ✓ Footer links work
       ✓ Language toggle works

    5. Test forms
       ✓ Newsletter signup submits
       ✓ Review form submits (if applicable)

    6. Mobile responsive
       ✓ Test on mobile viewport
       ✓ Menu collapses properly

    7. SEO validation
       ✓ Visit /sitemap.xml - Shows all URLs with /en/ and /es/ prefixes
       ✓ Visit /robots.txt - Allows crawling
       ✓ Check page source - Meta tags present

    8. Performance
       ✓ Run Lighthouse audit
       ✓ Performance score > 90
       ✓ Page load < 2 seconds

  AUTOMATED_TESTS: |
    # Check sitemap has locale prefixes
    curl https://silver-pineapple-xxx.pages.dev/sitemap.xml | grep "/en/"
    curl https://silver-pineapple-xxx.pages.dev/sitemap.xml | grep "/es/"

    # Check specific pages return 200
    curl -I https://silver-pineapple-xxx.pages.dev/en
    curl -I https://silver-pineapple-xxx.pages.dev/es
    curl -I https://silver-pineapple-xxx.pages.dev/en/rooms/unit-2528

  IF_ERRORS: |
    - 500 errors: Check Cloudflare Pages logs for exceptions
    - 404 errors: Verify middleware matcher pattern
    - Missing translations: Check message file bundling
    - Widget not loading: Check CSP headers and script sources


Task 12: Setup Continuous Deployment
  PLATFORM: Cloudflare Pages (automatic)

  VERIFY: |
    1. In Cloudflare Pages dashboard, check "Builds & deployments"
    2. Should show "Automatic deployments enabled"
    3. Every push to `main` branch triggers new deployment

  BRANCH_PREVIEWS: |
    - Cloudflare auto-creates preview deployments for PRs
    - Each branch gets unique URL: https://abc123.silver-pineapple.pages.dev
    - Useful for testing before merging to main

  ROLLBACK: |
    - If deployment breaks, use Cloudflare dashboard
    - Pages > Deployments > View previous deployments
    - Click "Rollback to this deployment" on last working version
```

---

## Validation Loop

### Level 1: Pre-Deployment Build Validation

```bash
# Step 1: Clean build to ensure no cached issues
rm -rf .next .worker-next

# Step 2: Install dependencies
npm install

# Step 3: Standard Next.js build (should work first)
npm run build

# Expected output:
#   ✓ Compiled successfully
#   ✓ Collecting page data
#   ✓ Generating static pages (33/33)
#   ✓ Finalizing page optimization
#
# Route (app)                                 Size  First Load JS
# ├ ● /[locale]                            9.61 kB         140 kB
# ├ ● /[locale]/rooms/[slug]               39.3 kB         165 kB
# └ ...

# If errors: Fix Next.js build issues first before OpenNext


# Step 4: OpenNext build for Cloudflare
npm run pages:build

# Expected output:
#   Building Next.js application...
#   ✓ Compiled successfully
#   Creating Cloudflare Workers bundle...
#   ✓ Worker bundle created
#
# Verify .worker-next/ directory exists:
ls -la .worker-next/
# Should show:
#   index.mjs      (Workers entry point)
#   assets/        (Static files)

# If errors:
# - "nodejs_compat not enabled": Add to wrangler.toml
# - "Module resolution failed": Check imports in i18n/request.ts
# - "Build timeout": Reduce bundle size or check for infinite loops
```

### Level 2: Local Preview Validation

```bash
# Start local preview in Workers runtime
npm run pages:dev

# Server should start on http://localhost:8788
# Test in browser:

# Test 1: Home page (English)
open http://localhost:8788/en
# ✓ Page loads
# ✓ Navigation bar shows English text
# ✓ Content in English

# Test 2: Home page (Spanish)
open http://localhost:8788/es
# ✓ Page loads
# ✓ Navigation bar shows Spanish text
# ✓ Content in Spanish

# Test 3: Room detail page
open http://localhost:8788/en/rooms/unit-2528
# ✓ Room details display
# ✓ Images load
# ✓ Pricing shows
# ✓ Booking widget iframe appears

# Test 4: Language switching
# Click language toggle in nav
# ✓ URL changes from /en to /es
# ✓ Content switches to Spanish

# Test 5: Console errors
# Open browser DevTools console
# ✓ No red errors
# ✓ No "Translation missing" warnings

# If errors:
# - Check browser console for specific error messages
# - Check terminal for server-side errors
# - Verify messages/en.json and messages/es.json exist
```

### Level 3: Sitemap Validation

```bash
# After local build, check generated sitemap
npm run build

# Visit sitemap locally (if using `npm run dev`)
curl http://localhost:3000/sitemap.xml

# Verify sitemap includes locale prefixes:
# Should see:
#   <url><loc>https://silverpineapple.net/en</loc></url>
#   <url><loc>https://silverpineapple.net/es</loc></url>
#   <url><loc>https://silverpineapple.net/en/rooms/unit-2528</loc></url>
#   <url><loc>https://silverpineapple.net/es/rooms/unit-2528</loc></url>

# Count URLs (should be ~60+: 30 pages × 2 locales)
curl http://localhost:3000/sitemap.xml | grep -o "<url>" | wc -l

# If missing locale prefixes:
# - Check sitemap.ts modifications from Task 7
# - Ensure both locales are iterated over
```

### Level 4: Production Deployment Validation

```bash
# After Cloudflare Pages deployment, test live site

# Get deployment URL from Cloudflare dashboard
# Example: https://silver-pineapple-abc123.pages.dev

DEPLOY_URL="https://silver-pineapple-abc123.pages.dev"

# Test 1: HTTP status codes
curl -I $DEPLOY_URL/en
# Expected: HTTP/2 200

curl -I $DEPLOY_URL/es
# Expected: HTTP/2 200

curl -I $DEPLOY_URL/en/rooms/unit-2528
# Expected: HTTP/2 200

# Test 2: Sitemap accessibility
curl $DEPLOY_URL/sitemap.xml | head -20
# Should see XML with locale-prefixed URLs

# Test 3: Robots.txt
curl $DEPLOY_URL/robots.txt
# Should allow crawling

# Test 4: Translations loaded
curl $DEPLOY_URL/en | grep "Book Now"
# Should find English text

curl $DEPLOY_URL/es | grep "Reservar Ahora"
# Should find Spanish text

# Test 5: Response time
time curl -s $DEPLOY_URL/en > /dev/null
# Expected: < 2 seconds

# If errors:
# - 500 errors: Check Cloudflare Pages function logs
# - 404 errors: Check routing and middleware configuration
# - Slow response: Check bundle size and lazy loading
```

### Level 5: Lighthouse Performance Audit

```bash
# Use Lighthouse CLI (npm install -g lighthouse) or Chrome DevTools

# Run Lighthouse audit
lighthouse https://silver-pineapple-abc123.pages.dev/en --view

# Target scores:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90

# Common issues and fixes:
# - Low performance: Optimize images, lazy load components
# - Low accessibility: Add alt text, ARIA labels
# - Low SEO: Check meta tags, structured data

# Check Core Web Vitals:
# - LCP (Largest Contentful Paint): < 2.5s
# - FID (First Input Delay): < 100ms
# - CLS (Cumulative Layout Shift): < 0.1
```

---

## Final Validation Checklist

### Pre-Deployment ✅
- [ ] `npm run build` completes successfully (no Next.js errors)
- [ ] `npm run pages:build` completes successfully (OpenNext builds)
- [ ] `.worker-next/` directory created with index.mjs and assets/
- [ ] `npm run pages:dev` starts local server on http://localhost:8788
- [ ] Local preview shows home page in English (/en)
- [ ] Local preview shows home page in Spanish (/es)
- [ ] Local preview shows room detail page (/en/rooms/unit-2528)
- [ ] Language toggle switches between /en and /es routes
- [ ] No console errors in browser DevTools
- [ ] Sitemap includes locale prefixes (/en/*, /es/*)

### Deployment Configuration ✅
- [ ] wrangler.toml created with correct compatibility settings
- [ ] Cloudflare Pages project configured in dashboard
- [ ] Build command set to: `npm run pages:build`
- [ ] Build output directory set to: `.worker-next`
- [ ] Environment variables configured (if any)
- [ ] Custom domain configured (if applicable)

### Post-Deployment ✅
- [ ] Production URL accessible (https://silver-pineapple-xxx.pages.dev)
- [ ] All pages return HTTP 200 status
- [ ] Sitemap.xml accessible and includes locale-prefixed URLs
- [ ] Robots.txt accessible and allows crawling
- [ ] English pages show English content
- [ ] Spanish pages show Spanish content
- [ ] Language toggle works on live site
- [ ] All 18 room pages accessible (test sample of 3-5)
- [ ] Booking widgets load from Hospitable CDN
- [ ] Newsletter signup form works (if applicable)
- [ ] Google Analytics fires page views (check Real-Time reports)
- [ ] Mobile responsive design works
- [ ] Images load correctly (check for missing images)
- [ ] Navigation links work correctly
- [ ] Footer links work correctly

### Performance & SEO ✅
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse SEO score > 90
- [ ] Page load time < 2 seconds (measured in Chrome DevTools)
- [ ] Core Web Vitals within acceptable ranges
- [ ] Meta tags present in page source (check via "View Source")
- [ ] Open Graph tags present for social sharing
- [ ] Twitter Card tags present
- [ ] Sitemap submitted to Google Search Console (post-launch)

### Continuous Deployment ✅
- [ ] Automatic deployments enabled in Cloudflare Pages
- [ ] Test: Push to main branch triggers deployment
- [ ] Branch previews enabled for pull requests
- [ ] Rollback tested (if previous deployment exists)

---

## Anti-Patterns to Avoid

### ❌ Runtime Configuration Mistakes
```typescript
// DON'T: Use Edge runtime with OpenNext
export const runtime = 'edge';  // Breaks OpenNext Cloudflare

// DO: Use Node.js runtime (default, omit export)
// Simply don't export runtime in your page files
```

### ❌ Hardcoding Environment Variables
```typescript
// DON'T: Hardcode URLs or IDs
const siteUrl = "https://silverpineapple.net";

// DO: Use environment variables
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://silverpineapple.net";
```

### ❌ Skipping Local Testing
```bash
# DON'T: Deploy directly without local testing
npm run deploy  # Risky!

# DO: Test locally first
npm run pages:build
npm run pages:dev
# Test thoroughly, then deploy
npm run deploy
```

### ❌ Ignoring Build Errors
```bash
# DON'T: Ignore warnings during build
⚠ Using edge runtime on a page currently disables static generation
# This warning means you're using edge runtime somewhere - find and fix

# DO: Fix all errors and warnings before deployment
# Read error messages carefully
# Search documentation for solutions
```

### ❌ Committing Build Output
```bash
# DON'T: Commit .worker-next/ to Git
git add .worker-next/  # Never do this

# DO: Add to .gitignore
echo ".worker-next/" >> .gitignore
```

### ❌ Missing Compatibility Flags
```toml
# DON'T: Omit required compatibility settings
compatibility_date = "2023-01-01"  # Too old, will break

# DO: Use correct compatibility settings
compatibility_date = "2024-09-23"  # Minimum for OpenNext
compatibility_flags = ["nodejs_compat"]  # REQUIRED
```

### ❌ Not Testing i18n Routes
```bash
# DON'T: Only test /en routes
curl https://site.com/en  # Only testing English

# DO: Test both locales
curl https://site.com/en
curl https://site.com/es
# Test language switching
```

### ❌ Forgetting Sitemap Locale Prefixes
```typescript
// DON'T: Generate sitemap without locale prefixes
urls.push({ url: `https://site.com/rooms/${slug}` });

// DO: Include locale in URL
urls.push({ url: `https://site.com/en/rooms/${slug}` });
urls.push({ url: `https://site.com/es/rooms/${slug}` });
```

---

## Troubleshooting Guide

### Issue: Build fails with "nodejs_compat not enabled"
**Error**: `Error: The nodejs_compat compatibility flag is required`

**Solution**:
1. Check `wrangler.toml` has: `compatibility_flags = ["nodejs_compat"]`
2. Ensure `compatibility_date = "2024-09-23"` or later
3. Run `npm run pages:build` again

### Issue: Translations not loading (INVALID_MESSAGE errors)
**Error**: `Error: INVALID_MESSAGE` or `Error: MISSING_MESSAGE: common (en)`

**Solution**:
1. Verify `messages/en.json` and `messages/es.json` exist
2. Check JSON files are valid (no syntax errors)
3. Verify dynamic import in `i18n/request.ts`:
   ```typescript
   messages: (await import(`../messages/${locale}.json`)).default
   ```
4. Test locally with `npm run pages:dev`

### Issue: 404 on all routes
**Error**: All routes return 404 Not Found

**Solution**:
1. Check middleware matcher pattern in `middleware.ts`
2. Verify `.worker-next/` directory was created during build
3. Check Cloudflare Pages build output directory is set to `.worker-next`
4. Verify routes in Cloudflare Pages function logs

### Issue: Static generation not working
**Error**: Pages render but not statically generated

**Solution**:
1. Check `generateStaticParams()` functions are present
2. Verify you're NOT using `export const runtime = 'edge'`
3. Check build output shows "Generating static pages (33/33)"
4. Review Next.js build logs for warnings

### Issue: Booking widget not loading
**Error**: Hospitable widget iframe doesn't appear

**Solution**:
1. Verify script tag in `app/[locale]/layout.tsx`:
   ```html
   <script src="https://hospitable.b-cdn.net/direct-property-search-widget/hospitable-search-widget.prod.js"></script>
   ```
2. Check browser console for CSP (Content Security Policy) errors
3. Verify `hospitable_id` in room data is correct
4. Test widget loads on Hospitable's platform first

### Issue: Slow build times on Cloudflare Pages
**Error**: Build exceeds 15-minute timeout

**Solution**:
1. Check project size (large node_modules?)
2. Optimize dependencies (remove unused packages)
3. Use `.npmrc` to skip optional dependencies:
   ```
   optional=false
   ```
4. Contact Cloudflare support for build timeout increase

### Issue: Custom domain not working
**Error**: Domain shows Cloudflare error or doesn't resolve

**Solution**:
1. Verify DNS settings in Cloudflare DNS dashboard
2. For apex domain (silverpineapple.net):
   - Add CNAME to `silver-pineapple-xxx.pages.dev` (with proxy ON)
   - OR add A records to Cloudflare's anycast IPs
3. For subdomain (www.silverpineapple.net):
   - Add CNAME to `silver-pineapple-xxx.pages.dev`
4. Wait for DNS propagation (up to 24 hours, usually < 1 hour)
5. Check SSL certificate status in Cloudflare dashboard

---

## Success Criteria Validation

After completing all tasks and validation steps, verify:

1. **✅ Deployment Status**
   - Cloudflare Pages deployment shows "Success" status
   - Production URL accessible via HTTPS
   - Custom domain configured (if applicable)

2. **✅ Functionality**
   - All 30+ pages accessible
   - i18n routing works (/en/* and /es/* routes)
   - Language toggle switches correctly
   - Forms submit successfully
   - Booking widgets load

3. **✅ SEO & Performance**
   - Sitemap includes all locale-prefixed URLs
   - Meta tags present on all pages
   - Lighthouse scores > 90
   - Page load times < 2 seconds

4. **✅ Continuous Deployment**
   - Git push to main triggers automatic deployment
   - Build completes in < 5 minutes
   - Deployment history visible in dashboard

5. **✅ Monitoring**
   - Google Analytics tracks page views
   - Cloudflare Analytics shows traffic
   - Error rates < 0.1%

**Confidence Level**: 9/10 for successful implementation
**Estimated Time to Complete**: 6-10 hours (including testing and validation)
**Risk Level**: LOW (greenfield deployment, static data, proven compatibility)

---

## Additional Resources

### Official Documentation
- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Next.js Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [next-intl Documentation](https://next-intl.dev/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)

### Project-Specific Context Files
- `PRPs/ai_docs/opennext-cloudflare-setup.md` (23KB setup guide)
- `PRPs/ai_docs/nextintl-opennext-compatibility.md` (compatibility research)
- `PRPs/planning/cloudflare-opennext-migration-analysis.md` (24KB codebase analysis)

### Community Resources
- [OpenNext GitHub Repository](https://github.com/opennextjs/opennextjs-cloudflare)
- [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

### Support Channels
- Cloudflare Pages support: dash.cloudflare.com (Support tab)
- OpenNext issues: GitHub Issues on opennextjs/opennextjs-cloudflare
- next-intl issues: GitHub Issues on amannn/next-intl

---

**PRP Version**: 1.0
**Last Updated**: 2025-10-19
**Status**: Ready for Implementation
**Confidence Score**: 9/10
