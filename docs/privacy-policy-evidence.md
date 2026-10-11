# Privacy policy evidence inventory

Every statement on `/[locale]/privacy` traces to a row below. Observed on
2026-10-11 against `main` at `97308af` (rebased onto `7d822bb`, which merged #32) and the live site (`https://silverpineapple.net`),
in headless Chromium with a fresh profile, before and after clicking
"Accept analytics cookies". No secret values were read or printed: env files were
listed by variable name only, and the Resend CLI was used read-only.

## Who we are

| Fact | Proof |
| --- | --- |
| Trading name "Silver Pineapple" | `app/[locale]/layout.tsx:30-31` (`creator`, `publisher`) |
| Published location "Melbourne, FL 32935", owner-confirmed 2026-09-05 | `app/data/contact.ts:10`, `AGENTS.md` "Business facts" |
| Public email `hello@silverpineapple.net`; phone/WhatsApp `+1 (201) 282-7398` | `app/data/contact.ts:9,16`, rendered in `app/components/Footer.tsx:96-122` |
| Legal entity "Silver Pineapple LLC" | `layout.tsx:29`; confirmed by the owner 2026-10-11 |
| Street address withheld; city/state/ZIP plus email published | owner's choice 2026-10-11 — street can be added later |
| Privacy contact `gabriel@silverpineapple.net` | owner's choice 2026-10-11; `app/data/contact.ts` `privacyEmail`. MX for `silverpineapple.net` is Google Workspace (`aspmx.l.google.com`, priority 1) plus Proton (`mail.protonmail.ch`, 10); no Cloudflare Email Routing on the account (`wrangler email routing list`: none). Whether the `gabriel@` mailbox exists could not be checked from here (outbound SMTP blocked) |

## Data a visitor gives us

| Flow | Fields | Where it goes | Proof |
| --- | --- | --- | --- |
| Newsletter signup (home page) | first name, email; Turnstile token | `POST /api/newsletter/subscribe` → Cloudflare Turnstile `siteverify` (token + visitor IP as `remoteip`) → Resend `POST /contacts` (`email`, `first_name`) | `app/components/BoutiqueNewsletterSignup.tsx:157-167,287,343,365`; `app/api/newsletter/subscribe/route.ts:11-15,41-49,84-91,157-167,278-294` |
| Newsletter language + interests | `locale` (en/es), `newsletter_interests` (ids of ticked boxes) | Resend contact properties | Form already sends `interests` (`BoutiqueNewsletterSignup.tsx:165,246-249`); stored since https://github.com/gabomsambo/silce/pull/32 merged (`lib/newsletterSegment.ts`, `route.ts:292`). Resend account (`resend contact-properties list`, read-only) already defines `locale` (fallback `en`) and `newsletter_interests` (fallback ``), both created 2026-10-11 |
| Newsletter resubscribe | an earlier unsubscribed contact is set back to subscribed on a new signup | Resend `PATCH /contacts/<email>` | `route.ts:195-244` |
| Failed newsletter signup logging | masked email (first character + domain) | server log (Cloudflare) | `route.ts:34-39,205-250,305-308` |
| Contact form (footer, every page) | name, email, message, the page URL; hidden `_honey` spam trap | FormSubmit (`https://formsubmit.co/ajax/hello@silverpineapple.net`), which emails the business inbox | `app/components/ContactForm.tsx:27-41`; `app/data/contact.ts:15` |
| Review form (`/reviews`) | name, email, property, overall + four category ratings, review text, optional stay date | **On `main` today it sends nothing** (`ReviewSubmissionForm.tsx:143-145` simulates a submit). Another worker is wiring it to email delivery via Resend; the page describes that end state. Re-check before final push | `app/components/ReviewSubmissionForm.tsx:17-41,139-175` |
| Booking (room pages) | first name, last name, email, phone, number of guests, dates; then payment | Entered in Hospitable's widget/checkout on `booking.hospitable.com`, not on our pages; payment through Stripe (loaded inside the widget) | `app/components/BookingIframe.tsx:6,84-89`; checkout page observed via the widget's BOOK NOW link (no submission): fields "First name \*", "Last name \*", "Email \*", "Phone \*", "Guests" |
| Email / phone / WhatsApp | whatever the visitor sends | business inbox; WhatsApp (Meta) for `wa.me` links | `Footer.tsx:71-122` |
| Visit data | IP address, request headers, pages requested | Cloudflare (every response: `server: cloudflare`, `cf-ray`); Cloudflare NEL error reporting header (`report-to` → `a.nel.cloudflare.com`, `success_fraction: 0.0`) | `curl -sSI https://silverpineapple.net/en`; `wrangler.toml` (Cloudflare Pages project) |

## Cookies and browser storage

Observed with `Storage.getCookies` and per-frame `localStorage` / `sessionStorage`
reads across `/en`, `/en/rooms/unit-2536`, `/en/search`, `/en/reviews`, `/en/about`.
Identical before and after accepting analytics.

| Name | Kind | Set by | Duration observed | Purpose / proof |
| --- | --- | --- | --- | --- |
| `silver-pineapple-cookie-consent` | localStorage | us | until cleared; reset by footer "Cookie preferences" | stores `accepted` / `declined` — `app/components/cookieConsent.ts:3,26-58`; `Footer.tsx:134-140` |
| `NEXT_LOCALE` | cookie, first-party, no expiry (session), `SameSite=Lax` | us (next-intl middleware) | session | set only when the visited language differs from the browser's language: `curl -H 'Accept-Language: en-US' /es` returns `set-cookie: NEXT_LOCALE=es`, `/en` returns none — `middleware.ts`, `i18n/routing.ts` |
| `_ga`, `_ga_<id>`, `_gid`, `_gat*` | cookies | Google Analytics | — | only after "Accept": `GoogleAnalytics.tsx:16-49`; cleared on decline `cookieConsent.ts:6-8,62-82`. **Live build has no measurement ID**: the shipped chunk reads `l.env.NEXT_PUBLIC_ANALYTICS_ID` un-inlined (`.env.example` placeholder only; not in `wrangler.toml [vars]`) and no `googletagmanager.com` request was made after accepting |
| `cf.turnstile.u` | localStorage (origin `challenges.cloudflare.com`) | Cloudflare Turnstile | persistent | anti-spam check; loads on the home page with the newsletter form, before any consent choice — `BoutiqueNewsletterSignup.tsx:287` |
| `translation_language` | cookie (`booking.hospitable.com`, `SameSite=None`) | Hospitable | 30 days (expires 2026-11-10 when set 2026-10-11) | widget language |
| `ph_phc_…_posthog` (+ `_window_id`, `_primary_window_exists`) | localStorage + sessionStorage (`booking.hospitable.com`) | Hospitable's PostHog analytics | persistent / session | requests to `ph.hospitable.com`; the BOOK NOW link carries `ph_session_id` and `ph_distinct_id` |
| `m` | cookie (`m.stripe.com`, `SameSite=None`) | Stripe | ~13 months (expires 2027-11-15) | Stripe, loaded inside the booking widget |
| `_ab`, `_mf`, `id` | sessionStorage (`m.stripe.network`) | Stripe | session | as above |

## Third-party hosts requested before any consent choice

| Host | Pages | Why / proof |
| --- | --- | --- |
| `hospitable.b-cdn.net` | every page | search-widget script in `<head>` — `app/[locale]/layout.tsx:143` |
| `a/b/c.tile.openstreetmap.org` | home (and room pages' map) | Leaflet tiles — `app/components/EauGallieMap.tsx:58-61` |
| `challenges.cloudflare.com` | home | Turnstile — `BoutiqueNewsletterSignup.tsx:287` |
| `booking.hospitable.com`, `api.hospitable.com`, `ph.hospitable.com`, `js.stripe.com`, `m.stripe.network`, `m.stripe.com`, `fonts.gstatic.com` | room pages | booking iframe and what it loads — `BookingIframe.tsx:84-89` |
| `api.hospitable.com`, `fonts.googleapis.com`, `fonts.gstatic.com` | `/search` | search widget; its bundle requests `fonts.googleapis.com/css2?family=Montserrat` |

Not present: no `googletagmanager.com` / `google-analytics.com` request (before or after
accepting), no Cloudflare Web Analytics beacon (`cloudflareinsights`), no other
analytics on our own pages. The site's own font (Geist) is self-hosted via `next/font`.

## Service configuration (read-only)

- Resend sending domain `silverpineapple.net`: verified, region `eu-west-1`, sending
  enabled, receiving disabled (`resend domains list`).
- Resend contact properties: `locale`, `newsletter_interests` (`resend contact-properties list`).
- Turnstile public site key in `wrangler.toml [vars]`; secret and Resend key are
  server-only env bindings (`route.ts:255-263`, `.env.example`).

## Retention (owner answers 2026-10-11)

| Data | Page says | Source |
| --- | --- | --- |
| Newsletter contacts | kept while subscribed; an unsubscribe marks the Resend contact unsubscribed, the record stays and a new signup resubscribes it; full deletion on request | `route.ts:195-244` (resubscribe path). No automatic deletion exists — follow-up, not promised on the page |
| Contact messages, review submissions | kept as long as needed for the reason sent, longer only where law requires; deletion on request | owner: mirror Airbnb; Airbnb Privacy Policy §10.1 (https://www.airbnb.com/help/article/3175, last updated 2026-02-05) |
| Bookings and payments | the site stores none; Hospitable / Stripe / Airbnb policies govern | no database, no API route besides `/api/newsletter/subscribe`, booking runs in the `booking.hospitable.com` iframe (`BookingIframe.tsx`); Airbnb listings evidenced by `app/data/reviews.ts` Airbnb records. Hospitable's policy (https://hospitable.com/legal/privacy-policy) states no retention period |
