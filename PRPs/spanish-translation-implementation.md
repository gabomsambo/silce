# Spanish Translation with SEO Support - Implementation PRP

**Feature:** Full Spanish language support with SEO optimization for Silver Pineapple website
**Framework:** Next.js 15 App Router + next-intl library
**Status:** Ready for Implementation
**Estimated Effort:** 12-16 hours (includes testing and validation)

---

## Goal

Implement comprehensive Spanish language support for the Silver Pineapple boutique rental website with full SEO optimization, enabling:
1. Users to toggle between English and Spanish with persistent language preference
2. Search engines to index Spanish content separately for improved Hispanic market reach
3. All UI text, page content, and metadata to be professionally translated
4. Locale-based routing structure (`/en/*` and `/es/*`)

**Deliverable:** Fully functional bilingual website where:
- Clicking "ES" button switches entire site to Spanish with URL change
- Language preference persists across sessions via localStorage
- Spanish pages are crawlable and indexable by Google
- All metadata (titles, descriptions, OG tags) are translated
- Hreflang tags link English/Spanish equivalents

**Success Definition:**
- All 245+ text strings translated and displaying correctly
- `/es/` routes accessible and properly rendered
- Google Search Console validates hreflang implementation
- Build completes with no errors
- Language preference saves to localStorage and persists

---

## Why

**Business Value:**
- **Market Expansion**: Melbourne, FL has 25%+ Hispanic population - Spanish support captures underserved market
- **Competitive Advantage**: Most local short-term rentals are English-only
- **SEO Benefits**: Separate Spanish content ranks for `alquiler vacacional Melbourne FL` and similar Spanish searches
- **User Experience**: Hispanic travelers feel welcomed and can navigate confidently

**Integration with Existing Features:**
- Leverages existing Next.js 15 App Router architecture
- Works seamlessly with Hospitable booking widget
- Maintains current Vercel deployment workflow
- No changes to existing data structures or API integrations

**Problems This Solves:**
- **For Users**: Language barrier preventing Hispanic travelers from booking
- **For Business**: Missing revenue from 25% of local population
- **For SEO**: Not ranking for Spanish language search queries

---

## What

### User-Visible Behavior

**Language Toggle:**
1. Desktop navbar shows "ES" button next to "BOOK NOW"
2. Mobile menu shows "TRANSLATE TO SPANISH" button
3. Clicking switches entire site to Spanish, URL changes to `/es/current-page`
4. Language icon updates to show active language
5. Preference saved to localStorage - returns to Spanish on next visit

**Content Translation:**
- All navigation links, buttons, headings translated
- Hero text, introductions, descriptions in Spanish
- Room categories and amenities in Spanish
- Form labels and validation messages in Spanish
- Footer content and legal text in Spanish

**SEO Implementation:**
- English pages: `/en/about`, `/en/rooms/unit-2528`
- Spanish pages: `/es/acerca-de`, `/es/alojamientos/unit-2528`
- Each page includes hreflang tags pointing to alternate language
- Metadata (title, description, OG tags) fully translated
- Sitemap includes both languages with language annotations

### Technical Requirements

1. **next-intl Integration**: Install and configure next-intl v3.x for Next.js 15
2. **Routing Restructure**: Move all routes under `app/[locale]/` directory
3. **Translation Files**: Create `messages/en.json` and `messages/es.json` with 245+ keys
4. **Middleware**: Implement locale detection + localStorage integration
5. **Component Refactor**: Replace hardcoded text with `useTranslations()` hooks
6. **Metadata Translation**: Update all `generateMetadata()` functions
7. **Navigation API**: Use next-intl's `<Link>` and `useRouter` for locale-aware navigation
8. **Language Switcher**: Update Navbar button to switch locales properly

### Success Criteria

- [ ] Build completes successfully: `npm run build` exits with code 0
- [ ] All routes accessible in both languages: `/en/*` and `/es/*`
- [ ] Navigation works: clicking links maintains current locale
- [ ] Language switcher functional: toggles between EN/ES with URL update
- [ ] localStorage persistence: language choice survives page refresh
- [ ] No hardcoded text visible: all strings come from translation files
- [ ] Metadata translated: page titles, descriptions, OG tags all in correct language
- [ ] Hreflang validation: TechnicalSEO.com hreflang checker shows no errors
- [ ] SEO test: Google Search Console preview shows Spanish metadata for /es/ pages
- [ ] Dev server runs without errors: `npm run dev` with no console warnings

---

## All Needed Context

### Documentation & References

```yaml
# CRITICAL - Read these documents in your context window

- docfile: PRPs/ai_docs/next-intl-nextjs15-reference.md
  why: |
    Complete next-intl setup guide with configuration examples.
    MUST READ sections: Installation, Configuration Files, Metadata & SEO.
    Contains critical patterns for generateMetadata() with locale support.

- docfile: PRPs/ai_docs/multilingual-seo-reference.md
  why: |
    SEO best practices for multilingual sites.
    CRITICAL sections: Hreflang implementation, URL structure, sitemap generation.
    Includes Google's official requirements for international SEO.

- docfile: PRPs/planning/spanish-i18n-codebase-analysis.md
  why: |
    Analysis of current codebase architecture.
    Shows all 38 components needing translation, current metadata patterns.
    Includes file tree, integration points, and Next.js 15 Edge Runtime gotchas.

- docfile: PRPs/planning/translation-text-inventory.md
  why: |
    Complete inventory of 245+ text strings to translate.
    Organized by component with DO NOT TRANSLATE sections for brand names.
    Use this to ensure no text is missed during refactor.

- docfile: PRPs/planning/spanish-translations.json
  why: |
    Professional Spanish translations ready to use.
    Includes translator notes and cultural considerations.
    Copy directly into messages/es.json structure.

# Official Documentation URLs

- url: https://next-intl.dev/docs/routing/middleware#locale-detection
  section: Locale Detection
  why: Shows how to integrate localStorage with middleware for persistence

- url: https://next-intl.dev/docs/routing/navigation#shared-pathnames
  section: Navigation APIs
  why: How to use Link and useRouter for locale-aware navigation

- url: https://next-intl.dev/docs/environments/metadata-route-handlers#generatemetadata
  section: Metadata Translation
  why: Pattern for translating metadata in Next.js 15 App Router

- url: https://developers.google.com/search/docs/specialty/international/localized-versions
  section: Hreflang Implementation
  why: Google's official requirements for multilingual SEO

# Codebase File References

- file: app/components/Navbar.tsx:57-66
  why: |
    Language switcher button already exists - needs onClick handler.
    Pattern: Client Component using useState and useRouter.

- file: app/page.tsx:11-32
  why: |
    Example of current metadata export pattern.
    Shows how metadata.openGraph.locale is currently hardcoded to 'en_US'.

- file: app/rooms/[slug]/page.tsx:9-55
  why: |
    Example of generateMetadata() with dynamic params.
    CRITICAL: Uses Next.js 15 async params - `const { slug } = await params`.

- file: next.config.mjs
  why: |
    Next.js configuration - need to add next-intl plugin.
    Currently has ignoreBuildErrors and images.unoptimized - preserve these.

- file: app/data/units.ts
  why: |
    Room data structure - NOT translating content, only display labels.
    Unit titles like "Studio - Compact" stay in English per user request.
```

### Current Codebase Tree

```bash
/Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/
├── app/
│   ├── layout.tsx                    # Root layout - NEEDS locale wrapper
│   ├── page.tsx                      # Home page - MOVE to [locale]/
│   ├── about/page.tsx                # MOVE to [locale]/about/
│   ├── rooms/
│   │   ├── page.tsx                  # MOVE to [locale]/rooms/
│   │   └── [slug]/page.tsx          # MOVE to [locale]/rooms/[slug]/
│   ├── reviews/page.tsx              # MOVE to [locale]/reviews/
│   ├── components/                   # ALL components need refactor
│   │   ├── Navbar.tsx               # Language switcher - UPDATE handler
│   │   ├── Footer.tsx               # Heavy text content - USE translations
│   │   ├── Hero.tsx                 # Main heading - TRANSLATE
│   │   └── ... (35 more components)
│   ├── data/
│   │   ├── units.ts                 # Room data - KEEP English (user choice)
│   │   ├── categories.ts            # Category labels - TRANSLATE
│   │   └── copy.ts                  # Site copy - MIGRATE to messages/
│   ├── sitemap.ts                   # MODIFY for multilingual
│   └── robots.ts                    # No changes needed
├── components/ui/                    # Shadcn UI - no changes needed
├── next.config.mjs                   # ADD next-intl plugin
├── tsconfig.json                     # No changes needed
└── package.json                      # ADD next-intl dependency
```

### Desired Codebase Tree (After Implementation)

```bash
/Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce/
├── app/
│   ├── [locale]/                     # NEW: Locale segment wrapper
│   │   ├── layout.tsx               # MOVED: Root layout with locale context
│   │   ├── page.tsx                 # MOVED: Home page
│   │   ├── about/page.tsx           # MOVED
│   │   ├── rooms/
│   │   │   ├── page.tsx             # MOVED
│   │   │   └── [slug]/page.tsx     # MOVED
│   │   └── reviews/page.tsx         # MOVED
│   ├── layout.tsx                   # NEW: Minimal root layout (providers only)
│   ├── sitemap.ts                   # MODIFIED: Generate for both locales
│   ├── robots.ts                    # Unchanged
│   ├── components/                  # MODIFIED: Use useTranslations()
│   └── data/                        # Mostly unchanged
├── messages/                         # NEW: Translation files
│   ├── en.json                      # English translations (245+ keys)
│   └── es.json                      # Spanish translations (245+ keys)
├── i18n/                            # NEW: next-intl configuration
│   ├── routing.ts                   # Locale config, pathnames
│   └── request.ts                   # Server-side message loading
├── middleware.ts                     # NEW: Locale detection + localStorage
├── next.config.mjs                   # MODIFIED: Add next-intl plugin
└── package.json                      # MODIFIED: Add next-intl dependency

# New files created: 6
# Modified files: ~45 (all pages + components)
# Deleted files: 0
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL GOTCHAS FOR THIS PROJECT

// 1. Next.js 15 Async Params Pattern
// In app/rooms/[slug]/page.tsx, params are now async
// BEFORE:
export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find((u) => u.slug === params.slug)  // ❌ OLD
}

// AFTER with next-intl:
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params  // ✅ Must await params first
  const t = await getTranslations({ locale, namespace: 'room' })
}

// 2. Edge Runtime Compatibility
// Room detail pages use Edge runtime (see app/rooms/[slug]/page.tsx)
// next-intl IS compatible with Edge, but message loading must use:
import { getRequestConfig } from 'next-intl/server';
// NOT dynamic imports of JSON files

// 3. TypeScript Strict Mode
// Project has `typescript.ignoreBuildErrors: true` in next.config.mjs
// This hides type errors - be extra careful with locale types:
type Locale = 'en' | 'es';  // Define explicitly
// Avoid: type Locale = string;  // Too loose, errors won't show

// 4. Hospitable Booking Widget
// Third-party widget (app/components/HospitableBookingWidget.tsx)
// Widget itself is English-only, but surrounding UI text should translate:
// TRANSLATE: "Select your dates", "Book Now" button
// DON'T TRANSLATE: Widget internals (calendar, form fields loaded from CDN)

// 5. localStorage Persistence Pattern
// middleware.ts reads cookies, NOT localStorage (server-side can't access localStorage)
// Language switcher must:
//   1. Update URL via router.push(`/es${pathname}`)
//   2. Write to localStorage for persistence
//   3. Let middleware handle actual routing

// Example from next-intl docs:
function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Set cookie for middleware to read on next request
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    // Navigate to same page in new locale
    router.push(`/${newLocale}${pathname}`);
  };
}

// 6. Build Configuration Preservation
// next.config.mjs currently has:
//   - images: { unoptimized: true }
//   - typescript: { ignoreBuildErrors: true }
//   - eslint: { ignoreDuringBuilds: true }
// MUST preserve these when adding next-intl plugin

// 7. Metadata Locale Format
// OpenGraph uses 'en_US' format (underscore)
// next-intl uses 'en' format (no region)
// Conversion needed in metadata:
const localeMap = { en: 'en_US', es: 'es_ES' };
openGraph: { locale: localeMap[locale] }

// 8. Static Data Translation Strategy
// app/data/copy.ts has large text blocks
// MIGRATE to messages/ files, don't keep separate data file
// Example:
// OLD: import { HERO_TEXT } from '@/app/data/copy'
// NEW: const t = useTranslations('hero'); return t('heading');

// 9. Component Patterns: Server vs Client
// Most pages are Server Components (no 'use client')
// Use: import { useTranslations } from 'next-intl';
//
// Client Components (Navbar, forms, etc.) also use same hook
// BUT must receive locale from props or useLocale() hook
//
// PATTERN for Server Components:
// export default async function Page({ params }) {
//   const { locale } = await params;
//   const t = await getTranslations({ locale, namespace: 'home' });
//   return <h1>{t('title')}</h1>;
// }

// 10. Translation Key Naming Convention
// Use hierarchical structure matching component tree:
// {
//   "navbar": { "home": "Home", "rooms": "Rooms" },
//   "hero": { "heading": "Upgrade Your Next Stay" },
//   "rooms": {
//     "categories": {
//       "studio-compact": "Compact Studio"
//     }
//   }
// }
// Access via: t('navbar.home'), t('hero.heading'), etc.
```

---

## Implementation Blueprint

### Phase 1: Infrastructure Setup (Foundation)

Install dependencies and create configuration files to establish the i18n infrastructure.

```yaml
Task 1: Install next-intl and Update Dependencies
COMMAND: npm install next-intl
FILES:
  - package.json (auto-updated)
  - package-lock.json (auto-updated)
VERIFY: Check package.json shows "next-intl": "^3.x.x"

Task 2: Create i18n Routing Configuration
CREATE: i18n/routing.ts
CONTENT:
  import { defineRouting } from 'next-intl/routing';

  export const routing = defineRouting({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always'  // URLs always include /en/ or /es/
  });

WHY: Defines supported locales and routing behavior
PATTERN: Copy exact structure from PRPs/ai_docs/next-intl-nextjs15-reference.md section "Routing Configuration"

Task 3: Create Server-Side Request Configuration
CREATE: i18n/request.ts
CONTENT:
  import { getRequestConfig } from 'next-intl/server';
  import { routing } from './routing';

  export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
      locale = routing.defaultLocale;
    }

    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default
    };
  });

WHY: Loads translation messages on the server for each request
CRITICAL: Uses dynamic import of JSON - compatible with Edge runtime
PATTERN: From next-intl-nextjs15-reference.md section "Request Configuration"

Task 4: Create Middleware for Locale Detection
CREATE: middleware.ts
CONTENT:
  import createMiddleware from 'next-intl/middleware';
  import { routing } from './i18n/routing';

  export default createMiddleware(routing);

  export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'  ]
  };

WHY: Intercepts requests to detect locale and redirect if needed
GOTCHA: matcher MUST exclude _next, api routes, and static files
PATTERN: From next-intl-nextjs15-reference.md section "Middleware"

Task 5: Update Next.js Configuration
MODIFY: next.config.mjs
FIND: "export default nextConfig;"
REPLACE WITH:
  import createNextIntlPlugin from 'next-intl/plugin';

  const withNextIntl = createNextIntlPlugin();

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // ... existing config (preserve images.unoptimized, ignoreBuildErrors)
  };

  export default withNextIntl(nextConfig);

WHY: Registers next-intl plugin with Next.js build process
CRITICAL: Preserve all existing config options
PATTERN: Wrap existing config, don't replace it
```

### Phase 2: Translation Files Creation

Create JSON translation files with all 245+ text strings in English and Spanish.

```yaml
Task 6: Create English Translation File
CREATE: messages/en.json
CONTENT:
  Copy structure from PRPs/planning/spanish-translations.json
  Populate with English text from PRPs/planning/translation-text-inventory.md

STRUCTURE:
  {
    "navbar": {
      "home": "Home",
      "rooms": "Rooms",
      "about": "About",
      "reviews": "Reviews",
      "bookNow": "BOOK NOW",
      "translateToSpanish": "TRANSLATE TO SPANISH"
    },
    "footer": {
      "quickLinks": "QUICK LINKS",
      "booking": "BOOKING",
      "contact": "CONTACT",
      "description": "Redefining hospitality through...",
      "copyright": "© 2024 Silver Pineapple. All rights reserved."
    },
    "hero": {
      "heading": "UPGRADE YOUR NEXT STAY",
      "subheading": "Experience charming boutique accommodations near the ocean"
    },
    "metadata": {
      "home": {
        "title": "Home",
        "description": "Discover boutique short-term rentals in Eau Gallie, Melbourne FL..."
      }
    }
    // ... (continue for all 245+ strings)
  }

WHY: Centralized English translations serve as source of truth
VERIFY: All strings from translation-text-inventory.md are present

Task 7: Create Spanish Translation File
CREATE: messages/es.json
CONTENT:
  Copy exact structure from messages/en.json
  Replace English values with Spanish translations from spanish-translations.json

STRUCTURE:
  {
    "navbar": {
      "home": "Inicio",
      "rooms": "Alojamientos",
      "about": "Acerca de",
      "reviews": "Opiniones",
      "bookNow": "RESERVAR AHORA",
      "translateToSpanish": "TRADUCIR AL ESPAÑOL"
    },
    // ... (same structure as en.json)
  }

WHY: Professional Spanish translations for all UI text
CRITICAL: Structure MUST match en.json exactly (same keys)
GOTCHA: Do NOT translate brand names like "Silver Pineapple"

Task 8: Validate Translation File Structure
COMMAND: node -e "const en = require('./messages/en.json'); const es = require('./messages/es.json'); console.log('Keys match:', JSON.stringify(Object.keys(en)) === JSON.stringify(Object.keys(es)))"
EXPECTED OUTPUT: "Keys match: true"
WHY: Ensures both files have identical structure
FIX IF FALSE: Compare files and add missing keys
```

### Phase 3: Routing Restructure

Move all routes under `app/[locale]/` directory to enable locale-based routing.

```yaml
Task 9: Create Locale Segment Directory
COMMAND: mkdir -p app/[locale]
WHY: Next.js dynamic segment for locale parameter

Task 10: Move Root Layout to Locale Segment
COMMAND: mv app/layout.tsx app/[locale]/layout.tsx
MODIFY: app/[locale]/layout.tsx
FIND: "export default function RootLayout({"
CHANGE TO:
  import { NextIntlClientProvider } from 'next-intl';
  import { getMessages } from 'next-intl/server';
  import { notFound } from 'next/navigation';
  import { routing } from '@/i18n/routing';

  export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
  }

  export default async function LocaleLayout({
    children,
    params
  }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
      notFound();
    }

    // Load messages
    const messages = await getMessages();

    return (
      <html lang={locale}>
        <body>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    );
  }

WHY: Wraps app in locale context, loads messages
CRITICAL: Must await params (Next.js 15 requirement)
PATTERN: From next-intl-nextjs15-reference.md section "Root Layout"

Task 11: Create New Root Layout (Minimal)
CREATE: app/layout.tsx
CONTENT:
  import type { ReactNode } from 'react';

  export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
  }

WHY: Next.js requires layout.tsx at app root
GOTCHA: This is a minimal wrapper - actual layout is in [locale]/layout.tsx

Task 12: Move Page Routes to Locale Segment
COMMANDS:
  mv app/page.tsx app/[locale]/page.tsx
  mv app/about app/[locale]/about
  mv app/rooms app/[locale]/rooms
  mv app/reviews app/[locale]/reviews

WHY: All content routes must be under [locale] for i18n
VERIFY: Check app/[locale]/ contains page.tsx, about/, rooms/, reviews/

Task 13: Update Metadata in Moved Pages
MODIFY: app/[locale]/page.tsx
FIND: "export const metadata: Metadata = {"
REPLACE WITH:
  import { getTranslations } from 'next-intl/server';

  export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.home' });

    return {
      title: t('title'),
      description: t('description'),
      alternates: {
        canonical: `/${locale}`,
        languages: {
          en: '/en',
          es: '/es'
        }
      },
      openGraph: {
        locale: locale === 'en' ? 'en_US' : 'es_ES',
        title: t('ogTitle'),
        description: t('ogDescription'),
        url: `/${locale}`,
        siteName: 'Silver Pineapple',
        images: ['/og-home.jpg'],
        type: 'website'
      }
    };
  }

WHY: Translates metadata and adds hreflang alternates
CRITICAL: Must convert locale 'en' → 'en_US' for OpenGraph
PATTERN: Repeat this pattern for about/page.tsx, rooms/page.tsx, reviews/page.tsx

Task 14: Update Dynamic Route Metadata
MODIFY: app/[locale]/rooms/[slug]/page.tsx
FIND: "export async function generateMetadata({ params }: Props): Promise<Metadata> {"
REPLACE WITH:
  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.room' });
    const unit = UNITS.find((u) => u.slug === slug);

    if (!unit) return {};

    const title = `${unit.title} | Silver Pineapple`;
    const description = t('description', {
      title: unit.title,
      guests: unit.maxGuests,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms
    });

    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/rooms/${slug}`,
        languages: {
          en: `/en/rooms/${slug}`,
          es: `/es/alojamientos/${slug}`
        }
      },
      openGraph: {
        locale: locale === 'en' ? 'en_US' : 'es_ES',
        title,
        description,
        url: `/${locale}/rooms/${slug}`,
        images: unit.images.length > 0 ? [unit.images[0]] : ['/og-room-default.jpg']
      }
    };
  }

WHY: Translates dynamic metadata with message interpolation
CRITICAL: Must destructure both locale AND slug from params
GOTCHA: Use t() with variables for dynamic content
```

### Phase 4: Component Refactoring

Replace all hardcoded text in components with translation hooks.

```yaml
Task 15: Update Navbar Component
MODIFY: app/components/Navbar.tsx
FIND: "const navLinks = ["
REPLACE WITH:
  'use client';

  import { useTranslations, useLocale } from 'next-intl';
  import { useRouter, usePathname } from 'next/navigation';

  export default function Navbar() {
    const t = useTranslations('navbar');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const navLinks = [
      { name: t('home'), href: '/' },
      { name: t('rooms'), href: '/rooms' },
      { name: t('about'), href: '/about' },
      { name: t('reviews'), href: '/reviews' }
    ];

    const switchLanguage = () => {
      const newLocale = locale === 'en' ? 'es' : 'en';

      // Save preference to cookie for middleware
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

      // Navigate to same page in new locale
      const currentPath = pathname.replace(/^\/(en|es)/, '');
      router.push(`/${newLocale}${currentPath}`);
    };

    return (
      <nav>
        {/* ... existing JSX */}
        <Button text={t('bookNow')} variant="primary" isBookingButton={true} />
        <button onClick={switchLanguage}>
          <Languages size={18} />
          <span>{locale === 'en' ? 'ES' : 'EN'}</span>
        </button>
      </nav>
    );
  }

WHY: Replaces hardcoded nav text with translations, adds language toggle
CRITICAL: Component is Client Component ('use client')
PATTERN: Use useTranslations hook for client components

Task 16: Update Footer Component
MODIFY: app/components/Footer.tsx
INJECT after imports:
  import { useTranslations } from 'next-intl';

  export default function Footer() {
    const t = useTranslations('footer');

FIND all hardcoded strings and replace:
  "QUICK LINKS" → {t('quickLinks')}
  "BOOKING" → {t('booking')}
  "CONTACT" → {t('contact')}
  "Redefining hospitality..." → {t('description')}
  "© 2024 Silver Pineapple..." → {t('copyright')}

WHY: Footer has extensive text content requiring translation
PATTERN: Footer is likely a Server Component - confirm no 'use client'

Task 17: Update Hero Component
MODIFY: app/components/Hero.tsx
INJECT after imports:
  import { useTranslations } from 'next-intl';

  export default function Hero() {
    const t = useTranslations('hero');

REPLACE:
  "UPGRADE YOUR NEXT STAY" → {t('heading')}
  "Experience charming boutique..." → {t('subheading')}

WHY: Hero text is key marketing copy needing translation

Task 18: Update All Remaining Components
ITERATE through all components in app/components/:
  - Introduction.tsx → useTranslations('introduction')
  - DiscoverLocationSection.tsx → useTranslations('location')
  - BoutiqueNewsletterSignup.tsx → useTranslations('newsletter')
  - AboutHeroSection.tsx → useTranslations('about.hero')
  - PhilosophySection.tsx → useTranslations('about.philosophy')
  - RoomsHeroSection.tsx → useTranslations('rooms.hero')
  - RoomCategorySection.tsx → useTranslations('rooms.categories')
  - ReviewsDisplay.tsx → useTranslations('reviews')
  - ... (continue for all 38 components)

PATTERN FOR EACH:
  1. Import useTranslations or inject into Server Component
  2. Create const t = useTranslations('namespace')
  3. Replace all hardcoded strings: "Text" → {t('key')}
  4. Ensure translation keys exist in messages/en.json

WHY: Complete translation coverage across entire app
VERIFY: Use translation-text-inventory.md as checklist
```

### Phase 5: Navigation API Integration

Update all internal links to use next-intl's locale-aware navigation.

```yaml
Task 19: Create Navigation Utilities
CREATE: i18n/navigation.ts
CONTENT:
  import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
  import { routing } from './routing';

  export const { Link, redirect, usePathname, useRouter } =
    createLocalizedPathnamesNavigation(routing);

WHY: Provides locale-aware versions of Link and useRouter
USAGE: Import from @/i18n/navigation instead of next/navigation

Task 20: Replace Next.js Link with next-intl Link
FIND in all components:
  import Link from 'next/link';

REPLACE WITH:
  import { Link } from '@/i18n/navigation';

WHY: next-intl Link automatically includes locale in URLs
EXAMPLE: <Link href="/about"> renders as <a href="/en/about"> or <a href="/es/acerca-de">
GOTCHA: Remove any manual locale prefixing in href props

Task 21: Update Router Usage
FIND in client components:
  import { useRouter } from 'next/navigation';

REPLACE WITH:
  import { useRouter } from '@/i18n/navigation';

WHY: next-intl router maintains locale during navigation
USAGE: router.push('/rooms') automatically goes to /en/rooms or /es/alojamientos
```

### Phase 6: SEO Optimization

Implement sitemap generation and SEO enhancements for multilingual support.

```yaml
Task 22: Update Sitemap Generation
MODIFY: app/sitemap.ts
REPLACE entire file with:
  import { MetadataRoute } from 'next';
  import { routing } from '@/i18n/routing';
  import { UNITS } from '@/app/data/units';

  export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://silverpineapple.net';
    const locales = routing.locales;

    // Static pages
    const staticPages = ['', '/about', '/rooms', '/reviews'];
    const staticEntries = staticPages.flatMap((page) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          )
        }
      }))
    );

    // Dynamic room pages
    const roomEntries = UNITS.flatMap((unit) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/rooms/${unit.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/rooms/${unit.slug}`])
          )
        }
      }))
    );

    return [...staticEntries, ...roomEntries];
  }

WHY: Generates sitemap entries for all pages in all locales
CRITICAL: Includes alternates for hreflang equivalents
VERIFY: Sitemap includes both /en/* and /es/* URLs

Task 23: Add Hreflang Meta Tags Verification
VERIFY in browser DevTools after deployment:
  1. Visit /en/about
  2. View page source
  3. Check for <link rel="alternate" hreflang="es" href="/es/acerca-de" />
  4. Check for <link rel="alternate" hreflang="en" href="/en/about" />
  5. Check for <link rel="alternate" hreflang="x-default" href="/en/about" />

WHY: Hreflang tags tell Google about language equivalents
EXPECTED: next-intl adds these automatically via alternates in metadata
FIX IF MISSING: Ensure metadata.alternates.languages is set in generateMetadata
```

### Phase 7: Data Migration

Migrate static copy from data files into translation system.

```yaml
Task 24: Audit app/data/copy.ts
READ: app/data/copy.ts (if exists)
ACTION: If file contains text content:
  1. Extract all text strings
  2. Add to messages/en.json under appropriate namespaces
  3. Add Spanish equivalents to messages/es.json
  4. Update components to use t() instead of importing copy.ts
  5. DELETE or empty copy.ts after migration

WHY: Centralize all translatable content in messages/ files
GOTCHA: Some projects have this file, some don't - check first

Task 25: Update Category Labels
MODIFY: app/data/categories.ts
CURRENT PATTERN:
  export const CATEGORIES = {
    'studio-compact': 'Compact Studio',
    'studio-comfort': 'Comfort Studio',
    // ...
  };

MIGRATION STRATEGY:
  Keep categories.ts for IDs only
  Move labels to messages/*/json

  messages/en.json:
  {
    "categories": {
      "studio-compact": "Compact Studio",
      "studio-comfort": "Comfort Studio",
      "studio-plus": "Plus (Large) Studio",
      "one-bed-1-bath": "1 Bedroom, 1 Bath",
      "two-bed-1-bath": "2 Bedrooms, 1 Bath"
    }
  }

  messages/es.json:
  {
    "categories": {
      "studio-compact": "Estudio Compacto",
      "studio-comfort": "Estudio Confort",
      "studio-plus": "Estudio Plus (Grande)",
      "one-bed-1-bath": "1 Habitación, 1 Baño",
      "two-bed-1-bath": "2 Habitaciones, 1 Baño"
    }
  }

COMPONENT USAGE:
  const t = useTranslations('categories');
  const categoryLabel = t(unit.category);  // 'studio-compact' → "Compact Studio"

WHY: Category labels need translation, but IDs stay English
GOTCHA: Use category key as translation key
```

---

## Validation Loops

### Level 1: Build & Type Checking

```bash
# Verify successful build with no errors
npm run build

# Expected output:
#   ✓ Generating static pages (x/x)
#   ✓ Finalizing page optimization
#   Route (app)                    Size     First Load JS
#   ├ ○ /en                        1.2 kB   85.3 kB
#   ├ ○ /en/about                  1.5 kB   86.1 kB
#   ├ ○ /en/rooms                  2.1 kB   87.8 kB
#   ├ ○ /es                        1.2 kB   85.3 kB
#   ├ ○ /es/acerca-de              1.5 kB   86.1 kB
#   └ ... (all routes in both locales)

# If errors occur:
# - Check for missing translation keys: "Missing message" errors
# - Verify all imports use correct paths after routing restructure
# - Ensure all async params are awaited: const { locale } = await params

# TypeScript check (informational only - ignoreBuildErrors is true)
npx tsc --noEmit

# If type errors shown:
# - Fix Locale type issues: Use type Locale = 'en' | 'es'
# - Fix params type: params: Promise<{ locale: string; slug?: string }>
```

### Level 2: Development Server Testing

```bash
# Start development server
npm run dev

# Manual testing checklist:

# Test 1: Root redirect
# Visit http://localhost:3000
# Expected: Redirects to http://localhost:3000/en (or /es if browser is Spanish)

# Test 2: English navigation
# Visit http://localhost:3000/en
# Expected: All text in English, nav links work, "ES" button visible
# Click "Rooms" → URL changes to /en/rooms
# Click "About" → URL changes to /en/about

# Test 3: Spanish navigation
# Click "ES" button
# Expected:
#   - URL changes to /es
#   - All text changes to Spanish
#   - Nav links now say "Inicio", "Alojamientos", "Acerca de", "Opiniones"
#   - Button now shows "EN" (to switch back)
# Click "Alojamientos" → URL changes to /es/alojamientos

# Test 4: Direct Spanish URL access
# Visit http://localhost:3000/es/acerca-de
# Expected: About page renders in Spanish, URL stays /es/acerca-de

# Test 5: Language persistence
# Set language to Spanish
# Refresh page (F5)
# Expected: Page stays in Spanish (localStorage + cookie working)
# Close tab, reopen http://localhost:3000
# Expected: Redirects to /es (preference persisted)

# Test 6: Dynamic routes
# Visit http://localhost:3000/en/rooms/unit-2528
# Expected: Room details in English, metadata correct
# Click "ES" button
# Expected: URL changes to /es/alojamientos/unit-2528, content in Spanish

# Test 7: Form validation
# Visit /en/reviews
# Submit form with empty fields
# Expected: Validation messages in English
# Switch to Spanish, submit again
# Expected: Validation messages in Spanish

# Test 8: Console errors
# Open browser DevTools console
# Navigate through site
# Expected: No errors or warnings
# If errors: Check for missing translation keys, incorrect imports
```

### Level 3: SEO Validation

```bash
# Test 1: View page source for hreflang tags
# Visit http://localhost:3000/en/about
# Right-click → "View Page Source"
# Search for "hreflang"
# Expected:
#   <link rel="alternate" hreflang="en" href="https://silverpineapple.net/en/about" />
#   <link rel="alternate" hreflang="es" href="https://silverpineapple.net/es/acerca-de" />
#   <link rel="alternate" hreflang="x-default" href="https://silverpineapple.net/en/about" />

# Test 2: Metadata inspection
# View source for /es/acerca-de
# Check <title> tag: Should be in Spanish
# Check meta description: Should be in Spanish
# Check og:locale: Should be "es_ES"
# Check og:title and og:description: Should be in Spanish

# Test 3: Sitemap generation
# Visit http://localhost:3000/sitemap.xml
# Expected: XML file with entries for both /en/* and /es/* URLs
# Verify each URL has <xhtml:link rel="alternate" hreflang="es" .../>

# Test 4: HTML lang attribute
# View source for /en/about
# Check <html> tag: <html lang="en">
# View source for /es/acerca-de
# Check <html> tag: <html lang="es">

# Test 5: Canonical URLs
# View source
# Check <link rel="canonical" href="..." />
# Expected: Points to current locale version (en page → /en/*, es page → /es/*)
```

### Level 4: Production Validation (After Deployment)

```bash
# Test 1: Google Rich Results Test
# Visit https://search.google.com/test/rich-results
# Enter URL: https://silverpineapple.net/en/about
# Expected: No errors, hreflang tags recognized

# Test 2: TechnicalSEO.com Hreflang Checker
# Visit https://technicalseo.com/tools/hreflang/
# Enter URL: https://silverpineapple.net/en
# Expected:
#   - All hreflang tags valid
#   - Bidirectional links present (en points to es, es points to en)
#   - x-default tag present

# Test 3: Google Search Console
# Add both /en/ and /es/ as separate properties (or use domain property)
# Submit sitemap.xml
# Expected: Both language versions indexed separately
# Check "International Targeting" report for errors

# Test 4: Manual Google Search
# Search: "boutique rental Melbourne FL" (English query)
# Expected: silverpineapple.net/en/... appears in results
# Search: "alquiler vacacional Melbourne FL" (Spanish query)
# Expected: silverpineapple.net/es/... appears in results (may take days/weeks)

# Test 5: Facebook Debugger
# Visit https://developers.facebook.com/tools/debug/
# Enter: https://silverpineapple.net/es/alojamientos
# Expected: Preview shows Spanish title and description
```

---

## Final Validation Checklist

- [ ] **Build Success**: `npm run build` completes with exit code 0
- [ ] **All Routes Accessible**: Both `/en/*` and `/es/*` URLs load without 404 errors
- [ ] **Translation Complete**: No hardcoded English text visible on Spanish pages
- [ ] **Navigation Works**: Clicking nav links maintains current locale
- [ ] **Language Switcher Functional**: "ES" button switches to Spanish, "EN" switches to English
- [ ] **URL Updates**: Language switch changes URL from `/en/page` to `/es/page`
- [ ] **Persistence Works**: Refresh page maintains language choice
- [ ] **Metadata Translated**: Page titles, descriptions, OG tags all in correct language
- [ ] **HTML Lang Correct**: `<html lang="en">` for English, `<html lang="es">` for Spanish
- [ ] **Hreflang Present**: View source shows alternate language links
- [ ] **Hreflang Valid**: TechnicalSEO.com reports no errors
- [ ] **Sitemap Multilingual**: sitemap.xml includes both locales with alternates
- [ ] **No Console Errors**: Browser DevTools shows no errors during navigation
- [ ] **Forms Work**: Contact/review forms validate in correct language
- [ ] **Dynamic Routes Work**: Room detail pages render in both languages
- [ ] **LocalStorage Set**: DevTools Application tab shows NEXT_LOCALE cookie
- [ ] **Build Size Reasonable**: Check .next bundle size didn't grow excessively (messages add ~50KB)

---

## Anti-Patterns to Avoid

### ❌ Don't: Use Client Component for Everything
```typescript
// BAD: Unnecessarily making server component a client component
'use client';
export default function AboutPage() {
  const t = useTranslations('about');
  return <h1>{t('title')}</h1>;
}
```

### ✅ Do: Keep Server Components When Possible
```typescript
// GOOD: Server component with async translation loading
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return <h1>{t('title')}</h1>;
}
```

---

### ❌ Don't: Forget to Await Params
```typescript
// BAD: Will cause runtime error in Next.js 15
export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find((u) => u.slug === params.slug);  // ❌ params is Promise
}
```

### ✅ Do: Always Await Params First
```typescript
// GOOD: Destructure after awaiting
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;  // ✅ Await first
  const unit = UNITS.find((u) => u.slug === slug);
}
```

---

### ❌ Don't: Hardcode Locale in URLs
```typescript
// BAD: Manually adding locale prefix
<Link href={`/${locale}/about`}>About</Link>
```

### ✅ Do: Use next-intl Link
```typescript
// GOOD: next-intl handles locale automatically
import { Link } from '@/i18n/navigation';
<Link href="/about">About</Link>  // Renders /en/about or /es/acerca-de
```

---

### ❌ Don't: Skip Translation Keys
```typescript
// BAD: Some text hardcoded, some translated
<div>
  <h1>{t('title')}</h1>
  <p>This is a description</p>  {/* ❌ Hardcoded */}
</div>
```

### ✅ Do: Translate Everything
```typescript
// GOOD: All text uses translation keys
<div>
  <h1>{t('title')}</h1>
  <p>{t('description')}</p>  {/* ✅ Translated */}
</div>
```

---

### ❌ Don't: Translate Brand Names or Place Names
```json
// BAD: messages/es.json
{
  "footer": {
    "brand": "Piña Plateada",  // ❌ Don't translate "Silver Pineapple"
    "location": "Melbourne, Florida"  // ❌ Don't translate place names
  }
}
```

### ✅ Do: Keep Proper Nouns in Original Language
```json
// GOOD: messages/es.json
{
  "footer": {
    "brand": "Silver Pineapple",  // ✅ Keep brand name
    "location": "Melbourne, FL"   // ✅ Keep place name
  }
}
```

---

### ❌ Don't: Ignore Metadata Locale Format
```typescript
// BAD: Using next-intl locale format in OpenGraph
openGraph: {
  locale: locale  // ❌ 'en' instead of 'en_US'
}
```

### ✅ Do: Convert Locale Format for OpenGraph
```typescript
// GOOD: Map to OpenGraph format
const ogLocale = locale === 'en' ? 'en_US' : 'es_ES';
openGraph: {
  locale: ogLocale  // ✅ 'en_US' or 'es_ES'
}
```

---

### ❌ Don't: Use localStorage in Middleware
```typescript
// BAD: Can't access localStorage on server
export default function middleware(request: Request) {
  const locale = localStorage.getItem('locale');  // ❌ Undefined on server
}
```

### ✅ Do: Use Cookies for Server-Side Persistence
```typescript
// GOOD: Read from cookie in middleware
export default createMiddleware({
  ...routing,
  // Middleware reads NEXT_LOCALE cookie automatically
});

// Client-side: Write to cookie when switching
document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
```

---

### ❌ Don't: Nest Dynamic Segments Incorrectly
```bash
# BAD: Wrong directory structure
app/
  [locale]/
    [slug]/  # ❌ Missing "rooms" folder
      page.tsx
```

### ✅ Do: Keep Correct Path Structure
```bash
# GOOD: Proper nesting
app/
  [locale]/
    rooms/
      [slug]/  # ✅ Correct path: /en/rooms/[slug]
        page.tsx
```

---

## Implementation Notes

### Estimated Timeline

- **Phase 1 (Infrastructure)**: 1-2 hours
- **Phase 2 (Translation Files)**: 2-3 hours
- **Phase 3 (Routing)**: 1-2 hours
- **Phase 4 (Components)**: 4-6 hours (largest phase)
- **Phase 5 (Navigation)**: 1 hour
- **Phase 6 (SEO)**: 1-2 hours
- **Phase 7 (Data Migration)**: 1 hour
- **Testing & Validation**: 2-3 hours

**Total**: 13-20 hours for complete implementation and validation

### Complexity Notes

- **Moderate Complexity**: next-intl has good documentation and clear patterns
- **Main Challenge**: Refactoring 38+ components to use translation hooks
- **Edge Cases**: Dynamic routes with Edge runtime (handled by next-intl)
- **Dependencies**: No breaking changes to existing features

### Success Confidence Score

**9/10** - High confidence for one-pass implementation success

**Reasoning:**
- ✅ Complete codebase analysis with all files identified
- ✅ Professional Spanish translations ready to use
- ✅ Comprehensive next-intl documentation and examples
- ✅ Clear validation strategy with multiple testing levels
- ✅ Well-documented gotchas and anti-patterns
- ✅ Existing language switcher UI already present
- ⚠️ Only risk: Human error during component refactoring (38 components is tedious)

**Mitigation for Risk:**
- Use translation-text-inventory.md as checklist
- Test frequently during Phase 4 (don't refactor all components then test)
- Run `npm run dev` after every 5-10 component refactors
- Use browser search to find remaining hardcoded text

---

## Additional Resources

### Testing URLs After Implementation

```
English:
- http://localhost:3000/en
- http://localhost:3000/en/about
- http://localhost:3000/en/rooms
- http://localhost:3000/en/rooms/unit-2528
- http://localhost:3000/en/reviews

Spanish:
- http://localhost:3000/es
- http://localhost:3000/es/acerca-de
- http://localhost:3000/es/alojamientos
- http://localhost:3000/es/alojamientos/unit-2528
- http://localhost:3000/es/opiniones
```

### SEO Validation Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **TechnicalSEO Hreflang Checker**: https://technicalseo.com/tools/hreflang/
- **Hreflang Tags Testing Tool**: https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/
- **Google Search Console**: https://search.google.com/search-console
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/

### Helpful Commands

```bash
# Check for hardcoded text in components (after refactor)
grep -r "UPGRADE YOUR" app/components/  # Should return 0 results

# Count translation keys
node -e "const en = require('./messages/en.json'); const count = (obj) => Object.keys(obj).reduce((sum, key) => sum + (typeof obj[key] === 'object' ? count(obj[key]) : 1), 0); console.log('Total keys:', count(en));"

# Validate JSON structure
npm install -g jsonlint
jsonlint messages/en.json
jsonlint messages/es.json

# Find components without useTranslations
grep -L "useTranslations\|getTranslations" app/components/*.tsx
```

---

## Post-Implementation Recommendations

### Phase 2 Enhancements (Future)

After initial Spanish implementation is complete and validated:

1. **URL Path Localization**: Update routing.ts to use localized paths
   ```typescript
   pathnames: {
     '/rooms': {
       en: '/rooms',
       es: '/alojamientos'
     },
     '/about': {
       en: '/about',
       es: '/acerca-de'
     }
   }
   ```

2. **Image Localization**: Create Spanish-specific images for marketing materials
   - `/og-home-es.jpg` for Spanish OpenGraph images
   - Localized screenshots if showing English UI

3. **Review Translation**: Translate existing guest reviews or add Spanish reviews
   - Currently reviews are in English (per translation-text-inventory.md)
   - Consider showing reviews in language they were written

4. **Hospitable Widget Localization**: Investigate if booking widget supports Spanish
   - Contact Hospitable support for multi-language options
   - May require custom CSS or JavaScript integration

5. **Additional Locales**: Expand to French, Portuguese if market demands
   - Infrastructure is already in place
   - Just add `fr` or `pt` to locales array and create messages/fr.json

### Monitoring & Maintenance

- **Google Search Console**: Monitor indexing of /es/ pages weekly
- **Google Analytics**: Track Spanish page traffic and conversions
- **Translation Updates**: When adding new features, update both messages files
- **A/B Testing**: Compare booking rates EN vs ES to measure ROI

---

## Quick Reference

### File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add next-intl dependency |
| `next.config.mjs` | Modify | Add next-intl plugin |
| `middleware.ts` | Create | Locale detection |
| `i18n/routing.ts` | Create | Locale configuration |
| `i18n/request.ts` | Create | Message loading |
| `i18n/navigation.ts` | Create | Locale-aware navigation |
| `messages/en.json` | Create | English translations (245+ keys) |
| `messages/es.json` | Create | Spanish translations (245+ keys) |
| `app/layout.tsx` | Create | Minimal root layout |
| `app/[locale]/layout.tsx` | Move+Modify | Root layout with locale context |
| `app/[locale]/page.tsx` | Move+Modify | Home page with translations |
| `app/[locale]/about/page.tsx` | Move+Modify | About page with translations |
| `app/[locale]/rooms/page.tsx` | Move+Modify | Rooms listing with translations |
| `app/[locale]/rooms/[slug]/page.tsx` | Move+Modify | Room details with translations |
| `app/[locale]/reviews/page.tsx` | Move+Modify | Reviews page with translations |
| `app/components/*.tsx` (38 files) | Modify | Replace hardcoded text with t() |
| `app/sitemap.ts` | Modify | Generate multilingual sitemap |

**Total**: 6 new files, 45+ modified files

---

**END OF PRP**

*This PRP provides complete context for implementing Spanish translation with SEO support. All necessary documentation, translations, patterns, and validation steps are included. Confidence score: 9/10 for one-pass implementation success.*
