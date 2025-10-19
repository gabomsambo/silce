# next-intl with Next.js 15 App Router - Complete Reference Guide

**Last Updated:** January 2025
**next-intl Version:** 3.x
**Next.js Version:** 15.2.4+

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Configuration Files](#configuration-files)
4. [Translation File Structure](#translation-file-structure)
5. [Using Translations](#using-translations)
6. [Metadata & SEO](#metadata--seo)
7. [Navigation](#navigation)
8. [Language Switching & Persistence](#language-switching--persistence)
9. [Sitemap Generation](#sitemap-generation)
10. [Common Pitfalls & Gotchas](#common-pitfalls--gotchas)
11. [Best Practices](#best-practices)
12. [Official Documentation Links](#official-documentation-links)

---

## Overview

next-intl is the recommended i18n solution for Next.js 15 App Router, providing:
- Locale-based routing (middleware-driven)
- Server & Client Component support
- Type-safe translations with TypeScript
- SEO optimization (hreflang, metadata, sitemaps)
- Seamless integration with Next.js navigation APIs

**Why next-intl?** Since Next.js App Router dropped built-in i18n routing, next-intl restores this functionality while providing a complete workflow for loading and rendering translations.

---

## Installation & Setup

### Step 1: Install the Package

```bash
npm install next-intl
```

### Step 2: Project Structure

Create the following directories and files:

```
your-project/
├── app/
│   └── [locale]/          # Locale-based routing folder
│       ├── layout.tsx     # Root layout
│       └── page.tsx       # Home page
├── messages/              # Translation files
│   ├── en.json
│   ├── es.json
│   └── fr.json
├── i18n/
│   ├── routing.ts         # Routing configuration
│   └── request.ts         # Request configuration
├── middleware.ts          # Locale detection middleware
└── next.config.ts         # Next.js config with plugin
```

---

## Configuration Files

### 1. Routing Configuration (`i18n/routing.ts`)

Defines supported locales and default locale:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Array of all supported locales
  locales: ['en', 'es', 'fr'],

  // Default locale (used when no locale in URL)
  defaultLocale: 'en',

  // Optional: Locale prefix behavior
  // 'always' - /en/about (default)
  // 'as-needed' - /about for default locale, /es/about for others
  // 'never' - /about for all locales (requires cookie/header detection)
  localePrefix: 'always',

  // Optional: Path translations
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      es: '/acerca-de',
      fr: '/a-propos'
    }
  }
});
```

**Official Docs:** https://next-intl.dev/docs/routing/configuration

---

### 2. Middleware (`middleware.ts`)

Handles locale detection and routing:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher ignoring `/_next` and all static files
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
```

**Advanced Configuration with Locale Detection:**

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,

  // Locale detection sources (in priority order)
  localeDetection: true, // Default: true

  // Custom locale detection via cookie
  defaultLocale: 'en',

  // Optional: Disable locale detection
  // localeDetection: false
});

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};
```

**Official Docs:** https://next-intl.dev/docs/routing/middleware

---

### 3. Request Configuration (`i18n/request.ts`)

Provides messages and locale to Server Components:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate incoming locale parameter
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

**With Time Zone Support:**

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
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'America/New_York', // Optional: Set default timezone
    now: new Date() // Optional: Set current time for consistent SSR/CSR
  };
});
```

**Official Docs:** https://next-intl.dev/docs/usage/configuration

---

### 4. Next.js Config (`next.config.ts`)

Link the request configuration:

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
};

export default withNextIntl(nextConfig);
```

**For JavaScript Config (`next.config.mjs`):**

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
};

export default withNextIntl(nextConfig);
```

---

### 5. Root Layout (`app/[locale]/layout.tsx`)

Wrap your app with locale-aware layout:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
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

  // Get messages for the locale
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
```

**Official Docs:** https://next-intl.dev/docs/getting-started/app-router

---

## Translation File Structure

### Basic JSON Structure (`messages/en.json`)

```json
{
  "HomePage": {
    "title": "Welcome to our site",
    "description": "Discover amazing properties"
  },
  "Navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "submit": "Submit"
  }
}
```

### Nested Namespaces (Recommended for Large Apps)

```json
{
  "auth": {
    "SignUp": {
      "title": "Sign up",
      "form": {
        "placeholder": "Please enter your name",
        "email": "Email address",
        "password": "Password",
        "submit": "Create Account"
      },
      "validation": {
        "emailRequired": "Email is required",
        "passwordTooShort": "Password must be at least 8 characters"
      }
    },
    "SignIn": {
      "title": "Sign in",
      "forgotPassword": "Forgot password?"
    }
  },
  "dashboard": {
    "welcome": "Welcome back, {name}!",
    "stats": {
      "views": "{count} views",
      "bookings": "{count, plural, =0 {No bookings} one {1 booking} other {# bookings}}"
    }
  }
}
```

### Best Practices for Organization

**1. Use Namespaces by Feature/Component:**
- `HomePage` - Home page strings
- `Navigation` - Navigation component strings
- `common` - Shared strings across multiple pages
- `auth` - Authentication flow strings
- `dashboard` - Dashboard-specific strings

**2. Naming Conventions:**
- Use dot notation for nesting: `auth.SignUp.title`
- PascalCase for component namespaces: `HomePage`, `SignUp`
- camelCase for keys: `emailRequired`, `forgotPassword`
- Avoid special characters (except underscores)

**3. Message Interpolation:**

```json
{
  "welcome": "Hello {name}!",
  "itemCount": "You have {count} items",
  "richText": "Visit <link>our website</link>",
  "plurals": "{count, plural, =0 {no items} one {1 item} other {# items}}"
}
```

**Official Docs:** https://next-intl.dev/docs/usage/messages

---

## Using Translations

### Server Components (Default)

**Basic Usage:**

```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

**With Message Interpolation:**

```typescript
import { useTranslations } from 'next-intl';

export default function WelcomePage({ userName }: { userName: string }) {
  const t = useTranslations('dashboard');

  return (
    <div>
      <h1>{t('welcome', { name: userName })}</h1>
      <p>{t('stats.views', { count: 1250 })}</p>
    </div>
  );
}
```

**With Pluralization:**

```typescript
import { useTranslations } from 'next-intl';

export default function BookingsList({ count }: { count: number }) {
  const t = useTranslations('dashboard.stats');

  return <p>{t('bookings', { count })}</p>;
  // count = 0: "No bookings"
  // count = 1: "1 booking"
  // count > 1: "5 bookings"
}
```

---

### Async Server Components

For components that need async data fetching:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage() {
  // Fetch user data
  const user = await fetchUser();

  // Get translations (awaitable)
  const t = await getTranslations('ProfilePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('greeting', { name: user.name })}</p>
    </div>
  );
}
```

**Use Cases for `getTranslations`:**
- Async Server Components
- Server Actions
- Route Handlers
- Metadata generation (see next section)

**Official Docs:** https://next-intl.dev/docs/environments/server-client-components

---

### Client Components

**Pattern 1: Pass Translations as Props (Recommended)**

```typescript
// Server Component (parent)
import { useTranslations } from 'next-intl';
import ExpandableSection from './ExpandableSection'; // Client Component

export default function FAQPage() {
  const t = useTranslations('FAQPage');

  return (
    <div>
      <ExpandableSection
        title={t('section1.title')}
        content={t('section1.content')}
      />
    </div>
  );
}
```

```typescript
// Client Component
'use client';

import { useState } from 'react';

export default function ExpandableSection({
  title,
  content
}: {
  title: string;
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <p>{content}</p>}
    </div>
  );
}
```

**Pattern 2: Use Translations Directly in Client Components**

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button onClick={() => setIsOpen(!isOpen)}>
      {t('changeLanguage')}
    </button>
  );
}
```

**Note:** Client Components can use `useTranslations` directly, but it's often more efficient to pass processed labels from Server Components to minimize client bundle size.

---

### Rich Text & HTML in Translations

```typescript
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function TermsPage() {
  const t = useTranslations('TermsPage');

  return (
    <div>
      {t.rich('agreement', {
        link: (chunks) => <Link href="/privacy">{chunks}</Link>,
        strong: (chunks) => <strong>{chunks}</strong>
      })}
    </div>
  );
}
```

**Translation file:**

```json
{
  "TermsPage": {
    "agreement": "By continuing, you agree to our <link>Privacy Policy</link> and <strong>Terms of Service</strong>."
  }
}
```

**Official Docs:** https://next-intl.dev/docs/usage/translations

---

## Metadata & SEO

### Basic Metadata Translation

```typescript
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Page() {
  return <div>Page content</div>;
}
```

**Translation file (`messages/en.json`):**

```json
{
  "Metadata": {
    "title": "Home - Silver Properties",
    "description": "Discover luxury short-term rentals in prime locations"
  }
}
```

---

### Advanced Metadata with Hreflang & Canonical URLs

```typescript
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  // Generate language alternates
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = `${BASE_URL}/${loc}`;
  });

  return {
    title: t('title'),
    description: t('description'),

    // Open Graph
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale,
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },

    // SEO: Canonical & Hreflang
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: languages,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

---

### Dynamic Metadata for Detail Pages

```typescript
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  // Fetch data for the page
  const property = await fetchProperty(slug);
  if (!property) return {};

  const t = await getTranslations({ locale, namespace: 'PropertyMetadata' });
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // Generate language alternates
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = `${BASE_URL}/${loc}/rooms/${slug}`;
  });

  return {
    title: t('title', { name: property.title }),
    description: t('description', {
      name: property.title,
      beds: property.specs.beds
    }),

    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images.map(img => ({
        url: img.url,
        alt: img.alt
      })),
      locale: locale,
    },

    alternates: {
      canonical: `${BASE_URL}/${locale}/rooms/${slug}`,
      languages: languages,
    },
  };
}

export default function PropertyPage({ params }: PageProps) {
  return <div>Property details</div>;
}
```

**Translation file:**

```json
{
  "PropertyMetadata": {
    "title": "{name} - Luxury Rental",
    "description": "Book {name} - {beds} beds, premium amenities"
  }
}
```

**Official Docs:** https://next-intl.dev/docs/environments/actions-metadata-route-handlers

---

## Navigation

### Setup Navigation Utilities (`i18n/navigation.ts`)

Create locale-aware navigation utilities:

```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

This creates wrappers around Next.js navigation APIs that automatically handle locale.

**Official Docs:** https://next-intl.dev/docs/routing/navigation

---

### Using `<Link>` Component

**In Server Components:**

```typescript
import Link from '@/i18n/navigation';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

**In Client Components:**

```typescript
'use client';

import Link from '@/i18n/navigation';

export default function MobileMenu() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/rooms">Rooms</Link>
    </nav>
  );
}
```

**With Dynamic Routes:**

```typescript
import Link from '@/i18n/navigation';

export default function RoomsList({ rooms }: { rooms: Room[] }) {
  return (
    <div>
      {rooms.map(room => (
        <Link key={room.slug} href={`/rooms/${room.slug}`}>
          {room.title}
        </Link>
      ))}
    </div>
  );
}
```

---

### Using `useRouter` Hook (Client Component)

```typescript
'use client';

import { useRouter } from '@/i18n/navigation';

export default function BookingButton({ roomId }: { roomId: string }) {
  const router = useRouter();

  const handleBooking = async () => {
    // Process booking...
    await processBooking(roomId);

    // Navigate to confirmation
    router.push('/confirmation');
  };

  return <button onClick={handleBooking}>Book Now</button>;
}
```

**Router Methods:**
- `router.push('/path')` - Navigate to path (client-side)
- `router.replace('/path')` - Replace current entry
- `router.back()` - Go back in history
- `router.refresh()` - Refresh current route

---

### Using `usePathname` Hook (Client Component)

```typescript
'use client';

import { usePathname } from '@/i18n/navigation';
import Link from '@/i18n/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav>
      <Link
        href="/"
        className={pathname === '/' ? 'active' : ''}
      >
        Home
      </Link>
      <Link
        href="/about"
        className={pathname === '/about' ? 'active' : ''}
      >
        About
      </Link>
    </nav>
  );
}
```

**Note:** `usePathname` returns the pathname **without** the locale prefix.

---

### Server-Side Redirects

```typescript
import { redirect } from '@/i18n/navigation';

export default function UnauthorizedPage() {
  // Server-side redirect
  redirect('/login');
}
```

**In Server Actions:**

```typescript
'use server';

import { redirect } from '@/i18n/navigation';

export async function createPost(formData: FormData) {
  const post = await savePost(formData);
  redirect(`/posts/${post.id}`);
}
```

---

## Language Switching & Persistence

### Language Switcher Component (Client Component)

**Basic Switcher with Cookies:**

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import Cookies from 'js-cookie';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Save to cookie for persistence
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });

    // Navigate to current page with new locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
```

---

### Language Switcher with LocalStorage

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('preferredLocale', locale);
  }, [locale]);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={locale === loc ? 'font-bold' : ''}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

---

### Middleware with Cookie Persistence

Update middleware to read from cookies:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Check for locale preference in cookies
  const preferredLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (preferredLocale && routing.locales.includes(preferredLocale as any)) {
    const { pathname } = request.nextUrl;

    // If no locale in path and user has preference, redirect
    const pathnameHasLocale = routing.locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      return Response.redirect(
        new URL(`/${preferredLocale}${pathname}`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
```

---

### Advanced Language Switcher with Translations

```typescript
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  return (
    <div>
      <label htmlFor="language-select">{t('selectLanguage')}</label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="border rounded px-2 py-1"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {LANGUAGE_NAMES[loc] || loc}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## Sitemap Generation

### Basic Multilingual Sitemap (`app/sitemap.ts`)

```typescript
import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;

  // Define your routes
  const routes = ['', '/about', '/contact', '/rooms'];

  // Generate sitemap entries
  const sitemapEntries = routes.flatMap((route) => {
    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${BASE_URL}/${loc}${route}`])
        ),
      },
    }));
  });

  return sitemapEntries;
}
```

---

### Dynamic Sitemap with Database Content

```typescript
import { routing } from '@/i18n/routing';
import { UNITS } from '@/app/data/units'; // Your static data
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;

  // Static routes
  const staticRoutes = ['', '/about', '/contact'];
  const staticEntries = staticRoutes.flatMap((route) => {
    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }));
  });

  // Dynamic routes (properties)
  const propertyEntries = UNITS.flatMap((unit) => {
    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/rooms/${unit.slug}`,
      lastModified: new Date(unit.updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${BASE_URL}/${loc}/rooms/${unit.slug}`])
        ),
      },
    }));
  });

  return [...staticEntries, ...propertyEntries];
}
```

---

### Sitemap with Index (Large Sites)

For sites with 50,000+ URLs, use sitemap index:

**`app/sitemap.ts` (Index):**

```typescript
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/sitemap/static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemap/properties.xml`,
      lastModified: new Date(),
    },
  ];
}
```

**`app/sitemap/static.xml/route.ts`:**

```typescript
import { routing } from '@/i18n/routing';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function GET() {
  const locales = routing.locales;
  const routes = ['', '/about', '/contact'];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes.flatMap(route =>
        locales.map(locale => `
          <url>
            <loc>${BASE_URL}/${locale}${route}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>${route === '' ? '1.0' : '0.8'}</priority>
          </url>
        `)
      ).join('')}
    </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
```

**Official Docs:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

---

## Common Pitfalls & Gotchas

### 1. Typescript Errors with JSON Imports

**Problem:** TypeScript infers JSON imports as `any` or loose types.

**Solution:** Generate type definitions for translations:

```typescript
// i18n/types.ts
import en from '@/messages/en.json';

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}
```

**Official Docs:** https://next-intl.dev/docs/workflows/typescript

---

### 2. Invalid Message Format Errors

**Problem:** Error like `INVALID_MESSAGE: MALFORMED_ARGUMENT`

**Common Cause:** Using double curly braces in translations

```json
// ❌ Wrong
{
  "welcome": "Hello {{name}}"
}

// ✅ Correct
{
  "welcome": "Hello {name}"
}
```

---

### 3. 404 Errors with Locale Routes

**Problem:** Routes returning 404 despite correct setup.

**Checklist:**
- ✅ Middleware matcher pattern excludes static files
- ✅ `app/[locale]` folder structure is correct
- ✅ `generateStaticParams` in root layout returns all locales
- ✅ `routing.locales` matches actual locale folders

**Example Fix:**

```typescript
// middleware.ts
export const config = {
  // Ensure static files are excluded
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
```

---

### 4. Locale Not Persisting After Refresh

**Problem:** User's language choice resets on page reload.

**Solution:** Implement cookie-based persistence (see [Language Switching](#language-switching--persistence) section).

---

### 5. Server Component Using Client-Only Hooks

**Problem:** Error when using `useRouter` or `usePathname` in Server Components.

**Solution:**
- Use `redirect` or `getPathname` from `next-intl/server` for server actions
- Mark component as `'use client'` if interaction is needed

```typescript
// ❌ Wrong (Server Component)
import { useRouter } from '@/i18n/navigation';

export default function ServerComponent() {
  const router = useRouter(); // Error!
  return <div>...</div>;
}

// ✅ Correct (Server Action)
import { redirect } from '@/i18n/navigation';

export default function ServerComponent() {
  async function handleAction() {
    'use server';
    redirect('/success');
  }
  return <form action={handleAction}>...</form>;
}
```

---

### 6. Missing Translations Causing Errors

**Problem:** App crashes when translation key doesn't exist.

**Solution:** Provide fallback translations in `i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    // Fallback to default locale messages
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      return `${path} is not translated yet`;
    },
  };
});
```

---

### 7. Build Errors with Dynamic Imports

**Problem:** Build fails when using dynamic imports for messages.

**Solution:** Use static imports with conditional logic:

```typescript
// ❌ Can cause build issues
const messages = await import(`../messages/${locale}.json`);

// ✅ Better approach
let messages;
switch (locale) {
  case 'en':
    messages = (await import('../messages/en.json')).default;
    break;
  case 'es':
    messages = (await import('../messages/es.json')).default;
    break;
  case 'fr':
    messages = (await import('../messages/fr.json')).default;
    break;
  default:
    messages = (await import('../messages/en.json')).default;
}
```

---

### 8. Hydration Errors with Client Components

**Problem:** Hydration mismatch when using locale-specific formatting.

**Solution:** Use `now` prop in `NextIntlClientProvider`:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider
          messages={messages}
          now={new Date()} // Ensures consistent SSR/CSR
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## Best Practices

### 1. Organize Translations by Feature

```
messages/
├── en/
│   ├── common.json        # Shared strings
│   ├── navigation.json    # Navigation component
│   ├── home.json          # Home page
│   ├── auth.json          # Authentication
│   └── dashboard.json     # Dashboard
└── es/
    ├── common.json
    ├── navigation.json
    └── ...
```

**Import strategy:**

```typescript
// i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const messages = {
    ...(await import(`../messages/${locale}/common.json`)).default,
    ...(await import(`../messages/${locale}/navigation.json`)).default,
    ...(await import(`../messages/${locale}/home.json`)).default,
    // ... more files
  };

  return { locale, messages };
});
```

---

### 2. Keep Translations in Server Components

**Why:** Reduces client bundle size and improves performance.

```typescript
// ✅ Good: Translation in Server Component
import { useTranslations } from 'next-intl';
import InteractiveButton from './InteractiveButton'; // Client Component

export default function Page() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <InteractiveButton label={t('ctaButton')} />
    </div>
  );
}

// InteractiveButton.tsx
'use client';
export default function InteractiveButton({ label }: { label: string }) {
  return <button onClick={() => alert('Clicked!')}>{label}</button>;
}
```

---

### 3. Use TypeScript for Type Safety

**Setup (`global.d.ts`):**

```typescript
import en from './messages/en.json';

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}
```

**Benefit:** Autocomplete and type checking for translation keys:

```typescript
const t = useTranslations('HomePage');
t('title'); // ✅ Autocomplete available
t('invalidKey'); // ❌ TypeScript error
```

---

### 4. Implement Proper Error Boundaries

```typescript
// app/[locale]/error.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('Error');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button onClick={reset}>{t('retry')}</button>
    </div>
  );
}
```

---

### 5. Use Environment Variables for Base URL

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://example.com
```

```typescript
// Use in metadata, sitemap, etc.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
```

---

### 6. Optimize Images with Locale-Specific Alt Text

```typescript
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function PropertyImage({ src }: { src: string }) {
  const t = useTranslations('PropertyPage');

  return (
    <Image
      src={src}
      alt={t('imageAlt')}
      width={800}
      height={600}
    />
  );
}
```

---

### 7. Implement Proper Loading States

```typescript
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('common');

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{t('loading')}</p>
    </div>
  );
}
```

---

### 8. Use Consistent Date/Time Formatting

```typescript
import { useFormatter } from 'next-intl';

export default function EventDate({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  );
}
```

---

### 9. Lazy Load Translations for Large Apps

**For massive translation files, consider code splitting:**

```typescript
// i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Only load translations for current route
  const pathname = headers().get('x-pathname') || '';
  const namespace = getNamespaceFromPath(pathname);

  const messages = (await import(`../messages/${locale}/${namespace}.json`)).default;

  return { locale, messages };
});
```

---

### 10. Test Translations in CI/CD

**Validate translation files:**

```javascript
// scripts/validate-translations.js
const fs = require('fs');
const path = require('path');

const locales = ['en', 'es', 'fr'];
const baseLocale = 'en';

const basePath = path.join(__dirname, '../messages');
const baseTranslations = require(path.join(basePath, `${baseLocale}.json`));

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((keys, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object') {
      return keys.concat(getKeys(obj[key], fullKey));
    }
    return keys.concat(fullKey);
  }, []);
}

const baseKeys = getKeys(baseTranslations);

locales.forEach(locale => {
  if (locale === baseLocale) return;

  const translations = require(path.join(basePath, `${locale}.json`));
  const keys = getKeys(translations);

  const missingKeys = baseKeys.filter(k => !keys.includes(k));

  if (missingKeys.length > 0) {
    console.error(`❌ Missing keys in ${locale}:`, missingKeys);
    process.exit(1);
  }
});

console.log('✅ All translations are complete!');
```

**Add to `package.json`:**

```json
{
  "scripts": {
    "validate:translations": "node scripts/validate-translations.js"
  }
}
```

---

## Official Documentation Links

### Core Documentation
- **Main Docs:** https://next-intl.dev/docs
- **Getting Started (App Router):** https://next-intl.dev/docs/getting-started/app-router
- **Getting Started with Routing:** https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing

### Configuration
- **Routing Setup:** https://next-intl.dev/docs/routing/setup
- **Routing Configuration:** https://next-intl.dev/docs/routing/configuration
- **Middleware:** https://next-intl.dev/docs/routing/middleware
- **Request Configuration:** https://next-intl.dev/docs/usage/configuration

### Usage
- **Rendering Translations:** https://next-intl.dev/docs/usage/translations
- **Messages:** https://next-intl.dev/docs/usage/messages
- **Server & Client Components:** https://next-intl.dev/docs/environments/server-client-components
- **Metadata & Route Handlers:** https://next-intl.dev/docs/environments/actions-metadata-route-handlers

### Navigation
- **Navigation APIs:** https://next-intl.dev/docs/routing/navigation

### Advanced
- **TypeScript Integration:** https://next-intl.dev/docs/workflows/typescript

### Resources
- **GitHub Repository:** https://github.com/amannn/next-intl
- **npm Package:** https://www.npmjs.com/package/next-intl

### Related Next.js Documentation
- **Next.js App Router:** https://nextjs.org/docs/app
- **Next.js Metadata API:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Next.js Sitemap:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

---

## Additional Resources & Tutorials

### 2025 Guides
- **Build with Matija (2025):** https://www.buildwithmatija.com/blog/nextjs-internationalization-guide-next-intl-2025
- **i18nexus Tutorial:** https://i18nexus.com/tutorials/nextjs/next-intl
- **Phrase Blog:** https://phrase.com/blog/posts/next-js-app-router-localization-next-intl/

### SEO & Advanced Topics
- **Multilingual SEO with Next.js 15:** https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags
- **Multilingual Sitemap Implementation:** https://dev.to/oikon/implementing-multilingual-sitemap-with-next-intl-in-nextjs-app-router-1354
- **Next.js 15 Boilerplate:** https://github.com/AmuraDesign/Next.js-15-Next-Intl-Boilerplate

---

**End of Reference Document**

*This document is maintained for the Silver Properties project. Last updated: January 2025*
