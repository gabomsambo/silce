# PLANNING.md — Short‑Term Rental Site (Cursor Foundation)

**Last updated:** 2025-08-12

## 1) Vision & Scope
A fast, elegant marketing site for a boutique short‑term rental portfolio with a path to add:
- Direct booking (via PMS or custom backend)
- Availability display and lead capture
- Owner/admin utilities later

**Current state:** Frontend built with v0 export; migrating to Cursor for iterative work.

## 2) Architecture (current → target)
- **Frontend:** Next.js/React (from v0 export), Tailwind (if present), Vercel hosting.
- **PMS Integration (phase 2):** Hospitable API for availability/booking links; optional serverless API routes (Next.js API or separate service).
- **Analytics/SEO:** Next SEO, sitemap, OpenGraph; privacy‑friendly analytics (Plausible/Umami) or GA4.
- **Content:** JSON/MDX data for rooms/properties; images optimized with Next/Image.

## 3) Core User Journeys
- Browse properties → view details → click to book (PMS link or direct form)
- Contact host (lead capture) → email/CRM
- (Later) Date picker with availability (read‑only) → outbound to PMS booking

## 4) Pages & Components
- **Pages:** Home, Properties (grid), Property Detail, About, FAQ/Policies, Contact.
- **Components:** Nav, Footer, PropertyCard, Gallery, AmenitiesList, AvailabilityCTA, Reviews, Map, SEO tags.

## 5) Data Model (phase 1 - static)
```ts
Property {
  id: string
  name: string
  slug: string
  location: string
  heroImage: string
  gallery: string[]
  beds: number
  baths: number
  guests: number
  amenities: string[]
  nightlyFrom: number
  bookingUrl?: string
  description: string
}
```
Source as JSON/MDX in `/data/properties/`.

## 6) Environment & Secrets
Create `.env.local` for local dev:
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ANALYTICS_ID=
HOSPITABLE_API_KEY=   # (phase 2)
HOSPITABLE_ACCOUNT_ID= # (phase 2)
```
Never paste secrets into AI prompts.

## 7) Quality & Conventions
- **File size:** ≤ 500 LOC per file; split modules when approaching limit.
- **Styling:** Tailwind utility‑first; extract UI primitives for reuse.
- **Testing:** Vitest/Playwright as project grows (snapshots for components; basic e2e for critical flows).
- **Formatting:** Prettier + EditorConfig; type‑safe props; strict TS if the project is TS.

## 8) Performance
- Next/Image for all media; static generation when possible.
- Code‑splitting for heavy components.
- Lighthouse target: Performance ≥ 90, SEO ≥ 95.

## 9) Deployment
- Vercel Preview for PRs; Production via protected branch.
- CI: build + typecheck + lint.

## 10) Roadmap
- **Phase 1:** Polish UI, SEO, content pipeline, deploy marketing site.
- **Phase 2:** Read‑only availability, deep links to Hospitable.
- **Phase 3:** Lead capture + simple CMS (Contentlayer/Notion/Airtable).
