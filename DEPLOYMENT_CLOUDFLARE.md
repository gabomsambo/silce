# Cloudflare Pages deployment - Silver Pineapple

The site is a **Next.js static export** served by Cloudflare Pages. Every page is a
plain file; Cloudflare answers page views without running any code. Code runs for
exactly three things: the two form endpoints and the unprefixed-path locale
redirect.

## Why it is built this way

The site used to run through the OpenNext Cloudflare adapter, which executes a
~5 MB Worker that server-rendered every page on every request. That costs roughly
13-70 ms of CPU per request warm and 250-580 ms on a cold isolate, against the
10 ms CPU limit of the Workers Free plan that Pages Functions run under. Cloudflare
answers a request that goes over with `HTTP 503 "error code: 1102"`, and under
sustained traffic 25-90% of page requests failed (measured on both the Next 15 and
Next 16 builds). Nothing about the pages needs a server: no per-request data, no
cookies, no auth. Cloudflare's own docs say requests to static assets are free and
unlimited and bypass Functions entirely
(<https://developers.cloudflare.com/pages/functions/pricing/>), so the fix is to
ship static files rather than to buy a higher CPU limit.

## How it fits together

| Piece | Where | Runs code? |
| --- | --- | --- |
| Pages (EN/ES home, rooms, every unit, about, reviews, privacy, search) | `next build` with `output: 'export'` writes `out/`; `npm run pages:build` moves it to `.open-next/` | No - static files |
| `robots.txt`, `sitemap.xml`, `manifest.webmanifest` | `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` (`force-static`) | No |
| Client-side navigation | the `.txt` RSC payloads Next writes next to each page | No |
| Newsletter signup | `functions/api/newsletter/subscribe.ts` -> `server/newsletterSubscribe.ts` | Yes, only on form submit |
| Review note | `functions/api/reviews/submit.ts` -> `server/reviewSubmit.ts` | Yes, only on form submit |
| `/`, `/rooms`, `/rooms/*`, `/about`, `/privacy`, `/reviews`, `/search` (no locale prefix) | `functions/[[path]].ts` -> `server/localeRedirect.ts` | Yes: a 307 to `/en` or `/es` from the `NEXT_LOCALE` cookie or `Accept-Language` |

`public/_routes.json` is copied to the output root and lists the only paths that
invoke a Function (`/`, the unprefixed page paths, `/api/*`). Everything else,
including `/en/...` and `/es/...`, is served as a static asset. Pages allows at most
100 include/exclude rules in that file
(<https://developers.cloudflare.com/pages/functions/routing/>), which is why it is an
include list rather than a list of static routes.

The Function handlers read `process.env`; `server/pagesEnv.ts` copies the Pages
bindings (`RESEND_KEY`, `TURNSTILE_SECRET_KEY`) across and pins `NODE_ENV` to
`production`, because the Workers runtime does not define it and the Turnstile
hostname allow-list treats anything else as local development.

## Build

`npm run pages:build` = `next build` then `rm -rf .open-next && mv out .open-next`.
The Pages project is configured with build command `npm run pages:build` and output
directory `.open-next` (and `wrangler.toml` sets `pages_build_output_dir`); do not
change either without changing the other. `functions/` at the repo root is compiled
by Pages itself at deploy time.

Pages are static only if every page and layout under `app/[locale]/` calls
`setRequestLocale(locale)` before any next-intl call; otherwise next-intl reads the
locale from request headers and the static export fails. A new page or layout needs
the same call, and a new unit needs `generateStaticParams` coverage (it derives from
`UNITS`).

## Verify

- `npm run check:links` and `npm run check:icons` serve `.open-next` with
  `wrangler pages dev` (static files plus the Functions, with Pages' URL handling)
  and crawl it.
- `node scripts/check-preview.mjs https://<preview-host>` against a real deployment:
  every sitemap page, the redirect, both Functions, a 404, then a sustained run
  (default 600 requests at concurrency 6, no retries) that fails on **any** non-200.
  `.github/workflows/preview-smoke.yml` runs it against every PR's Cloudflare
  preview; make that check required in branch protection so a merge cannot outrun it.
- Cloudflare marks a deploy successful on upload and never sends a request, and
  local `wrangler pages dev` can differ from the Pages production runtime, so a
  Cloudflare preview URL is the source of truth, not localhost.

## Pages dashboard settings (set by hand, not in the repo)

- Build command `npm run pages:build`, output directory `.open-next`, framework
  preset none.
- Node version: the exact value in `.nvmrc` (Pages reads that file for its build
  image; wrangler needs Node 22 or newer).
- Production secrets `RESEND_KEY` and `TURNSTILE_SECRET_KEY` as encrypted
  variables; `.env.example` is the inventory. The preview environment has no
  secrets, so the form endpoints answer `500 service_unavailable` there, which
  `check-preview.mjs` accepts as proof the Function is deployed.
- Production deploys only by merge to `main`. Never run `wrangler pages deploy` by
  hand (see AGENTS.md).
