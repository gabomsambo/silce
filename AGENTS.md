# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Sharp edges

- **Install with `npm ci --ignore-scripts`.** That is what CI runs and what to use
  here; the Next build needs no postinstall step. The original reason — an
  `rclone.js` postinstall that downloaded a binary from a host that timed out — is
  gone as of the `next` 15.5.25 / `@opennextjs/cloudflare` 1.19.11 upgrade
  (`rclone.js` came in via `@opennextjs/cloudflare` 1.11.0 and is no longer in the
  lockfile). The packages that still have install scripts are `esbuild`,
  `fsevents`, `unrs-resolver` and `workerd`; the latter two download binaries, so
  dropping `--ignore-scripts` is a real behaviour change that needs its own
  verification.
- **Regenerate `package-lock.json` with the npm that ships with `.nvmrc`'s Node.**
  npm 11 writes `peer: true` markers and prunes optional peer entries (`@emnapi/*`)
  in a way npm 10 rejects outright: `npm ci` then dies with `EUSAGE ... can only
  install packages when your package.json and package-lock.json are in sync`. CI
  and Cloudflare Pages both install with `npm ci`, so a lockfile written by a newer
  npm fails the build while `npm ci` on the authoring machine stays green.
- **A green build no longer lies, but it still isn't a test suite.** The build now
  fails on type and lint errors (the `ignoreDuringBuilds` / `ignoreBuildErrors`
  escape hatches are gone) and `.github/workflows/ci.yml` runs typecheck, lint,
  build and the link crawl on every PR. There are still **no unit tests** — verify
  UI changes in a real browser against `npm run build && npx next start`.
- **Next 15.5 streams metadata *outside* `<head>`.** `<title>`, `canonical`, `robots`
  and `hreflang` are emitted after `</head>` in the served HTML, so checking a page's
  SEO tags by splitting on `</head>` gives a false "MISSING" on tags that are in fact
  present. Grep the whole document. (Next also spells the attribute `hrefLang`.)
- **`styles/globals.css` is orphaned.** Nothing imports it; the only stylesheet in
  play is `app/globals.css` (imported by `app/[locale]/layout.tsx`). The shadcn CSS
  variables live only in the orphan, so `bg-background`, `text-muted-foreground`,
  `rounded-lg` and friends silently render as nothing. Don't reach for them.
- **Names lie in `app/components/` and `components/ui/`.** Roughly a quarter of
  `app/components/` and most of the 56 files in `components/ui/` are unreferenced,
  and near-duplicate names differ in which one is live. Grep for the importer
  before editing anything.
- **Never run `npm run deploy` / `wrangler pages deploy`** — deployment is the
  repo owner's call. `npm run preview` is broken by construction here.

## Safety net

- `npm run check:links` crawls the built output in a real `next start` server and
  fails on internal 404s and on hrefs that drop the `/en` / `/es` prefix — the two
  bug classes that have shipped past a green build here. It needs `npm run build`
  first; `scripts/check-links.mjs` documents the rest.
- `eslint.config.mjs` extends `next/core-web-vitals`. Two rules with pre-existing
  violations (`react/no-unescaped-entities`, `@next/next/no-sync-scripts`) are
  demoted to warnings so the config passes on the current tree; everything else,
  notably `@next/next/no-html-link-for-pages`, is a hard error.
- CI installs with `npm ci --ignore-scripts` for the reason above.

## Shape

No database, no API routes, no server actions, no `use server`. All content is
hand-written TypeScript in `app/data/`, and every route prerenders at build time.

## Booking / units data

- `docs/UNITS-SOURCE-OF-TRUTH.md` is the authoritative reconciliation of Hospitable
  listings, the photo library and `app/data/units.ts`. `PLANNING.md`, `TASK.md`,
  `Apartments_matching.md` and `PRPs/` are historical and contradict the code.
- Hospitable IDs can be verified without credentials against the public booking API:
  `https://api.hospitable.com/bookings/api/properties/<id>` (name, `max_guests`) and
  `.../properties/<id>/calendar?start_date=&end_date=` (nightly `price`, used to derive
  `priceFrom`). That API exposes **no bedroom count** — the only bedroom signal is the
  listing `name` ("Studio" / "1BR" / "2BR"). Never call
  `/sites/widgets/<uuid>/ping`: it writes into the owner's Hospitable account.
- **The multi-property search widget (`/search`) is a different animal from the
  per-unit booking widget** — different bundle, different API, different language
  mechanism. `app/components/PropertySearchWidget.tsx` documents the live state.
  Its two endpoints, both credential-free and safe to `curl`:
  `GET /bookings/api/mps/widget/custom/<identifier>` (preflight: `enabled`, `locations`)
  and `GET /bookings/api/properties/search?site_id=<identifier>&start_date=&end_date=&adults=…`
  (`site_id` is the **identifier itself**, not the uuid the preflight returns; omitting
  `adults` 422s, so a well-formed query is easy to confirm). To test whether an identifier
  is real, call the preflight — an unknown one returns `404 Site not found`.
  **As of 2026-09-03 that search returns `[]` for every query, including one with no date
  constraint**, while the same properties are available and priced through the per-unit
  widget: the properties are not attached to the MPS site on Hospitable's side, which is a
  dashboard fix. `/search` is `noindex` until that changes — see the paired REMOVE comments
  in `PropertySearchWidget.tsx` and `app/[locale]/search/page.tsx`.
  Unlike the booking iframe below, this widget **does** render against a `localhost`
  referrer (its API sends `access-control-allow-origin: *`), so `/search` is verifiable
  end-to-end from `npm run build && npx next start`.
- The search widget's language comes from **`window.currentLocale`, read once at boot**, or
  `window.setMPSLanguage(lang)` afterwards — *not* the booking iframe's postMessage
  handshake. The layout sets the global before the widget script so the widget never paints
  English first. Same four languages (`en`/`fr`/`es`/`de`). Its calendar month and weekday
  names stay English regardless: those come from Angular's baked-in `LOCALE_ID`.
  Angular Elements dash-cases the widget's inputs, so `fullScreenMode` is the
  `full-screen-mode="false"` attribute — without it the widget reserves a viewport-tall
  block and an empty result set reads as a large silent void.
- The per-unit booking widget in `app/components/BookingIframe.tsx` takes its language
  from a **postMessage handshake, not a URL parameter**: on boot the iframe posts
  `{type:"GET_HOSPITABLE_LANGUAGE"}` to its parent and switches when the parent answers
  `{type:"SET_HOSPITABLE_LANGUAGE", language}`. It supports `en`, `fr`, `es`, `de` and
  falls back to English silently. The widget renders **blank** against a `localhost`
  referrer, so an empty booking box in local verification is expected and is not
  evidence of a regression — assert on the iframe's attributes instead.

## i18n

`routing.localePrefix` is `'always'`, so every in-app path carries `/en` or `/es`.
Import `Link`, `useRouter` and `usePathname` from `@/i18n/navigation` (not
`next/link` / `next/navigation`) — those wrappers add the prefix on hrefs and strip
it from `usePathname`, so path comparisons are written against `/rooms/...`.
Plain `next/navigation` `usePathname` returns `/en/rooms/...` and silently breaks
route matching.

`messages/en.json` and `messages/es.json` are the single source of every visible
string and must stay at exact key parity. The modules under `app/data/` hold
**message keys and facts, never display copy** — `categories.ts` has `nameKey`/
`blurbKey`/`badgeKey`, `units.ts` has `titleKey`, `mapMarkers.ts` has `titleKey`/
`descriptionKey`. The copy builders in `app/data/copy.ts` take a root-scoped
next-intl translator (`useTranslations()` / `getTranslations({locale})`) and compose
from the catalog. Adding a unit or category means adding its keys to **both** catalogs.

`units.ts` still stores `bedType`, `floor` and `extras` as English literals because
that file doubles as the operational record; `copy.ts` maps the known values onto
catalog keys and falls back to the raw literal, so an unrecognised value degrades
rather than throwing.

## Dependency pinning: `next` and `@opennextjs/cloudflare`

Both are pinned to exact versions on purpose — do not reintroduce a caret on either.

- **`next` must stay on the 15.5 backport line.** The 15.2.x and 15.3.x lines are no
  longer security-backported: their newest releases still carry ~26 open advisories.
  npm's `backport` dist-tag tracks the maintained 15.x line. Check any candidate against
  the real advisory data before bumping — `https://api.github.com/advisories?ecosystem=npm&affects=next`
  lists `vulnerable_version_range` per release line, and `npm audit` after installing
  confirms it; guessing patch numbers from an advisory's `first_patched_version` is
  unreliable because later advisories re-open earlier lines.
- **`@opennextjs/cloudflare` is pinned because `pages:build` does unguarded file surgery.**
  The script chains six `mv`/`cp` calls over `.open-next/worker.js` and `.open-next/assets/`
  with no assertions, so a minor bump that relocates either breaks production behind a
  fully green build. After any bump, assert the output contains `_worker.js`, `_next/`
  and `_routes.json` and that `assets/` is gone.
- Its `peerDependencies.next` range is the binding constraint on how low `next` may go
  (and versions `<1.17.1` carry a worker-runtime SSRF, GHSA-c7mq-gh6q-6q7c).
- 1.19.11 requires `wrangler ^4.86.0`, and wrangler `>=4.86` declares
  `engines.node >=22`, so this pin sets the repo's build-time Node floor — hence
  `.nvmrc` and `engines.node` in `package.json`. Cloudflare Pages must build on
  Node 20 or newer or `pages:build` dies in the adapter CLI before it prints
  anything (`yargs-parser` hard-throws), and on Node 22 or newer for `wrangler`.
- **`.nvmrc` must hold a full `major.minor.patch` version.** It is the only lever
  in the repo over the Node version Cloudflare Pages builds with, and the Pages
  build image wants an exact version: a bare major is not guaranteed to resolve,
  and when it does not, Pages silently falls back to its image default (18.17.1
  on build system v2) and the adapter CLI dies. `.github/workflows/ci.yml` reads
  the same file via `node-version-file`, so CI and Pages cannot drift and an
  unresolvable value fails CI first.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
