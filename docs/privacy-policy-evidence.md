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
| Published location "Melbourne, FL 32935", owner-confirmed 2026-09-05 | `app/data/contact.ts:13`, `AGENTS.md` "Business facts" |
| Public email `hello@silverpineapple.net`; phone/WhatsApp `+1 (201) 282-7398` | `app/data/contact.ts:10,19`, rendered in `app/components/Footer.tsx:96-122` |
| Legal entity "Silver Pineapple LLC" | `layout.tsx:29`; confirmed by the owner 2026-10-11 |
| Street address withheld; city/state/ZIP plus email published | owner's choice 2026-10-11 — street can be added later |
| Privacy contact `gabriel@silverpineapple.net` | owner's choice 2026-10-11; `app/data/contact.ts` `privacyEmail`. MX for `silverpineapple.net` is Google Workspace (`aspmx.l.google.com`, priority 1) plus Proton (`mail.protonmail.ch`, 10); no Cloudflare Email Routing on the account (`wrangler email routing list`: none). Whether the `gabriel@` mailbox exists could not be checked from here (outbound SMTP blocked) |

## Data a visitor gives us

| Flow | Fields | Where it goes | Proof |
| --- | --- | --- | --- |
| Newsletter signup (home page) | first name, email; Turnstile token | `POST /api/newsletter/subscribe` → Cloudflare Turnstile `siteverify` (token + visitor IP as `remoteip`) → Resend `POST /contacts` (`email`, `first_name`) | `app/components/BoutiqueNewsletterSignup.tsx:157-167,287,343,365`; `app/api/newsletter/subscribe/route.ts:21-27,93-99,170-180,293-311` |
| Newsletter language + interests | `locale` (en/es), `newsletter_interests` (ids of ticked boxes) | Resend contact properties | Form already sends `interests` (`BoutiqueNewsletterSignup.tsx:165,246-249`); stored since https://github.com/gabomsambo/silce/pull/32 merged (`lib/newsletterSegment.ts`, `route.ts:176-179,294`). Resend account (`resend contact-properties list`, read-only) already defines `locale` (fallback `en`) and `newsletter_interests` (fallback ``), both created 2026-10-11 |
| Newsletter resubscribe | an earlier unsubscribed contact is set back to subscribed on a new signup | Resend `PATCH /contacts/<email>` | `route.ts:195-244` |
| Newsletter server logs | masked email (first character + domain) when a Resend lookup, update or create fails, and when an existing contact is updated. Captcha and validation failures do not log the email. A successful first-time create does not log it either | server log (Cloudflare) | `app/api/newsletter/subscribe/route.ts:43-48,118-157,219-266,289-291,322-325` |
| Contact form (footer, every page) | name, email, message, the page URL; hidden `_honey` spam trap | The form sends the name, email, message and page address to FormSubmit (`https://formsubmit.co/ajax/hello@silverpineapple.net`), a form-relay service, which forwards them by email to the business inbox. Delivery depends on the one-time FormSubmit activation of hello@silverpineapple.net, which was found NOT activated on 2026-10-11 and was sent to the owner to click. The public page does not mention activation | `app/components/ContactForm.tsx:27-41`; `app/data/contact.ts:14-18` |
| Review form (`/reviews`) | guest name, email, property slug, overall rating, optional cleanliness/communication/location/value ratings, review text, optional stay date, page locale (`en`/`es`), Turnstile token | `POST /api/reviews/submit` → Cloudflare Turnstile `siteverify` (token + visitor IP as `remoteip`, action `review`) → Resend `POST /emails` to `hello@silverpineapple.net` from `reviews@silverpineapple.net` with `reply_to` the guest email; body built in `lib/reviewDelivery.ts` (`buildReviewMessage`). Success only after Resend returns an email id. Not posted on the site | `app/components/ReviewSubmissionForm.tsx:193-211,276`; `app/api/reviews/submit/route.ts:49-101,127-145`; `lib/reviewDelivery.ts:10-23,76-106`; `lib/turnstileVerify.ts:89-162` |
| Review server logs | a shortened email (first character + domain) is logged when Resend accepts the review email. It is not logged when sending fails: a Resend rejection logs status only, a malformed body logs no address, and a thrown request logs the error name only. Captcha and validation failures do not log the email | server log (Cloudflare) | acceptance log `app/api/reviews/submit/route.ts:88-91`; mask helper `32-37`. Send failures omit the address: `78`, `84`, `94-96`. The outer catch at `147-150` logs the masked address only if `sendReviewEmail` throws past its own catch, which those send failures do not |
| Booking (room pages) | first name, last name, email, phone, number of guests, dates; then payment | Entered in Hospitable's widget/checkout on `booking.hospitable.com`, not on our pages; payment through Stripe (loaded inside the widget) | `app/components/BookingIframe.tsx:6,84-89`; checkout page observed via the widget's BOOK NOW link (no submission): fields "First name \*", "Last name \*", "Email \*", "Phone \*", "Guests" |
| Email / phone / WhatsApp | whatever the visitor sends | business inbox; WhatsApp (Meta) for `wa.me` links | `Footer.tsx:71-122` |
| Visit data | IP address, request headers, pages requested | Cloudflare (every response: `server: cloudflare`, `cf-ray`); Cloudflare NEL error reporting header (`report-to` → `a.nel.cloudflare.com`, `success_fraction: 0.0`) | `curl -sSI https://silverpineapple.net/en`; `wrangler.toml` (Cloudflare Pages project) |

## Cookies and browser storage

Observed with `Storage.getCookies` and per-frame `localStorage` / `sessionStorage`
reads across `/en`, `/en/rooms/unit-2536`, `/en/search`, `/en/reviews`, `/en/about`.
Identical before and after accepting analytics.

| Name | Kind | Set by | Duration observed | Purpose / proof |
| --- | --- | --- | --- | --- |
| `silver-pineapple-cookie-consent` | localStorage | us | until cleared; reset by footer "Cookie preferences" | stores `accepted` / `declined` — `app/components/cookieConsent.ts:3,26-58`; `Footer.tsx:140-146` |
| `NEXT_LOCALE` | cookie, first-party, no expiry (session), `SameSite=Lax` | us (next-intl middleware) | session | set only when the visited language differs from the browser's language: `curl -H 'Accept-Language: en-US' /es` returns `set-cookie: NEXT_LOCALE=es`, `/en` returns none — `middleware.ts`, `i18n/routing.ts` |
| `_ga`, `_ga_<id>`, `_gid`, `_gat*` | cookies | Google Analytics | — | only after "Accept": `GoogleAnalytics.tsx:16-49`; cleared on decline `cookieConsent.ts:6-8,62-82`. **Live build has no measurement ID**: the shipped chunk reads `l.env.NEXT_PUBLIC_ANALYTICS_ID` un-inlined (`.env.example` placeholder only; not in `wrangler.toml [vars]`) and no `googletagmanager.com` request was made after accepting |
| `cf.turnstile.u` | localStorage (origin `challenges.cloudflare.com`) | Cloudflare Turnstile | persistent | anti-spam check; loads on the home page with the newsletter form and on `/reviews` with the review form, before any consent choice — `BoutiqueNewsletterSignup.tsx:287`; `ReviewSubmissionForm.tsx:276` |
| `translation_language` | cookie (`booking.hospitable.com`, `SameSite=None`) | Hospitable | 30 days (expires 2026-11-10 when set 2026-10-11) | widget language |
| `ph_phc_…_posthog` (+ `_window_id`, `_primary_window_exists`) | localStorage + sessionStorage (`booking.hospitable.com`) | Hospitable's PostHog analytics | persistent / session | requests to `ph.hospitable.com`; the BOOK NOW link carries `ph_session_id` and `ph_distinct_id` |
| `m` | cookie (`m.stripe.com`, `SameSite=None`) | Stripe | ~13 months (expires 2027-11-15) | Stripe, loaded inside the booking widget |
| `_ab`, `_mf`, `id` | sessionStorage (`m.stripe.network`) | Stripe | session | as above |

## Third-party hosts requested before any consent choice

| Host | Pages | Why / proof |
| --- | --- | --- |
| `hospitable.b-cdn.net` | every page | search-widget script in `<head>` — `app/[locale]/layout.tsx:143` |
| `a/b/c.tile.openstreetmap.org` | home (and room pages' map) | Leaflet tiles — `app/components/EauGallieMap.tsx:58-61` |
| `challenges.cloudflare.com` | home, `/reviews` | Turnstile — `BoutiqueNewsletterSignup.tsx:287`; `ReviewSubmissionForm.tsx:276` |
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
  server-only env bindings (`route.ts:270-277`, `.env.example`).

## Retention (owner answers 2026-10-11)

| Data | Page says | Source |
| --- | --- | --- |
| Newsletter contacts | kept while subscribed; an unsubscribe marks the Resend contact unsubscribed, the record stays and a new signup resubscribes it; full deletion on request | `route.ts:195-244` (resubscribe path). No automatic deletion exists — follow-up, not promised on the page |
| Contact messages | kept as long as needed for the reason sent, longer only where law requires; deletion on request. The page states FormSubmit forwards them to the inbox; it does not mention that forwarding waits on activation | owner: mirror Airbnb; Airbnb Privacy Policy §10.1 (https://www.airbnb.com/help/article/3175, last updated 2026-02-05). Delivery depends on the one-time FormSubmit activation of hello@silverpineapple.net, found NOT activated on 2026-10-11 and sent to the owner to click (`app/data/contact.ts:14-18`) |
| Review emails | kept in the inbox for as long as needed to read and respond, and longer only where the law requires it; deletion on request. Plain text on the page, with no link | Mirrored from Airbnb's Privacy Policy retention section, the same principle already used for contact messages: §10.1 (https://www.airbnb.com/help/article/3175, last updated 2026-02-05) retains personal information for as long as needed for the purpose it was obtained, consistent with applicable law. Owner direction 2026-10-11 was to copy Airbnb's published retention. Airbnb Help article 13 (https://www.airbnb.com/help/article/13), “Review display period”, does not apply: it governs how long a review stays publicly displayed on Airbnb, and these submissions are never published — the route only emails them to the inbox (`app/api/reviews/submit/route.ts`). |
| Bookings and payments | the site stores none; Hospitable / Stripe / Airbnb policies govern | no database; API routes `/api/newsletter/subscribe` and `/api/reviews/submit`; booking runs in the `booking.hospitable.com` iframe (`BookingIframe.tsx`); Airbnb listings evidenced by `app/data/reviews.ts` Airbnb records. Hospitable's policy (https://hospitable.com/legal/privacy-policy) states no retention period |
