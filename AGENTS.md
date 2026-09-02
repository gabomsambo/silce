# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Sharp edges

- **`npm ci` fails on this repo.** The `rclone.js` postinstall downloads a binary
  from a host that times out. Use `npm ci --ignore-scripts`; the Next build does
  not need any postinstall step.
- **A green build proves nothing.** `next.config.mjs` sets both
  `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, and there are no
  tests and no CI. Run `npx tsc --noEmit` explicitly, and verify UI changes in a
  real browser against `npm run build && npx next start`.
- **Never run `npm run deploy` / `wrangler pages deploy`** — deployment is the
  repo owner's call. `npm run preview` is broken by construction here.

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

## i18n

`routing.localePrefix` is `'always'`, so every in-app path carries `/en` or `/es`.
Import `Link`, `useRouter` and `usePathname` from `@/i18n/navigation` (not
`next/link` / `next/navigation`) — those wrappers add the prefix on hrefs and strip
it from `usePathname`, so path comparisons are written against `/rooms/...`.
Plain `next/navigation` `usePathname` returns `/en/rooms/...` and silently breaks
route matching.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
