# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Sharp edges

- **`npm ci` fails on this repo.** The `rclone.js` postinstall downloads a binary
  from a host that times out. Use `npm ci --ignore-scripts`; the Next build does
  not need any postinstall step.
- **A green build no longer lies, but it still isn't a test suite.** The build now
  fails on type and lint errors (the `ignoreDuringBuilds` / `ignoreBuildErrors`
  escape hatches are gone) and `.github/workflows/ci.yml` runs typecheck, lint,
  build and the link crawl on every PR. There are still **no unit tests** — verify
  UI changes in a real browser against `npm run build && npx next start`.
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

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
