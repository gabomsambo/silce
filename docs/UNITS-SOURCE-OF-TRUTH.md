# Units — Source of Truth

Reconciles three systems: **Hospitable** (`booking-widget-codes.md` export),
the **photo library** (`Fotos de todas las unidades/`), and the **site**
(`app/data/units.ts`).

Last reconciled: 2026-09-02.

## Naming key

| Token | Means |
|---|---|
| `PA` | **Pineapple** — Pineapple Ave building |
| `SG` | **Sea Grape** |
| `Ed` | *Edificio* (building), followed by its street number |

Three buildings: **Ed 2546 (PA)**, **Ed 1042 (SG)**, **Ed 1052 (SG)**.
Units `2526 / 2528 / 2536 / 2538` are PA and carry no `Ed` — the unit number
*is* the street number.

Note both SG buildings have a unit 101, so **`SG101 Ed 1042` and
`101 Ed 1052 SG` are two different apartments.** Never collapse them.

The PA building appears as `2456 Pineapple Ave` in photo filenames and
`Ed 2546` in Hospitable. **Not a data problem** — same building, two
internal ways of referring to it. Treat the Hospitable property ID as the
only join key; never match on the street number.

## Master table — 13 properties

Hospitable is authoritative for IDs. All 13 map 1:1 to a photo folder.

| # | Hospitable property | ID | Photo folder | Site slug | Photos |
|---|---|---|---|---|--:|
| 1 | Unit PA101 Ed 2546 | `2282914` | Fotos unidad 101 PA | `pineapple-101` | 6 |
| 2 | Unit PA102 Ed 2546 | `2282915` | Fotos unidad 102 PA | `pineapple-102` | 5 |
| 3 | Unit PA103 Ed 2546 | `2282916` | Fotos unidad 103 PA | `pineapple-103` | 5 |
| 4 | Unit PA104 Ed 2546 | `2282923` | Fotos unidad 104 PA | `pineapple-104` | 11 |
| 5 | Unit PA105 Ed 2546 | `2282917` | Fotos unidad 105 PA | — **no page** | 11 |
| 6 | Unit PA2526 | `2282928` | Fotos unidad 2526 PA | `unit-2526` | 8 |
| 7 | Unit PA2528 | `2282925` | Fotos unidad 2528 PA | `unit-2528` | 8 |
| 8 | Unit PA2536 | `2282918` | Fotos unidad 2536 PA | `unit-2536` | 5 |
| 9 | Unit PA2538 | `2282919` | Fotos unidad 2538 PA | `unit-2538` | 5 |
| 10 | Unit SG101 Ed 1042 | `2282921` | Fotos unidad 101 SG | — **no page** | 5 |
| 11 | Unit SG102 Ed 1042 | `2282920` | Fotos unidad 102 SG | `sea-grape-102` | 7 |
| 12 | Unit SG201 ED 1042 | `2282922` | Fotos unidad 201 SG | — **no page** | 5 |
| 13 | Unit 101 Ed 1052 SG | `2282929` | Fotos unidad 101 1052 SG | — **no page** | 10 |

Non-unit folders: `Fotos amenidades` (15), `Fotos de exterior` (23).
Library total: **129 files, all byte-distinct** (checksummed — no duplicates).

## Site ID migration — applied

Applied to `app/data/units.ts`. The old IDs were in the `18876xx / 1983780`
space (all returning HTTP 500); Hospitable now issues `22829xx`.

| Site slug | Old (retired) | Live in `units.ts` |
|---|---|---|
| `unit-2528` | `1887660` | `2282925` |
| `unit-2536` | `1887654` | `2282918` |
| `unit-2538` | `1887656` | `2282919` |
| `pineapple-102` | `1887648` | `2282915` |
| `sea-grape-102` | `1887662` | `2282920` |
| `unit-2526` | `1887652` | `2282928` |
| `pineapple-103` | `1887650` | `2282916` |
| `pineapple-104` | `1983780` ⚠ | `2282923` |
| `pineapple-101` | `1983780` ⚠ | `2282914` |

⚠ `pineapple-101` and `pineapple-104` previously shared one ID — one of the two
pages booked the wrong apartment. The new IDs resolve it.

`priceFrom` is the minimum nightly `price` over the next 12 months, read from
`.../properties/<id>/calendar`. Re-derive it there rather than editing by hand;
every value below the true floor advertises a rate no guest can book.

## Embed method

Site UUID `9f9d3a07-f287-40dc-bb60-1966173ea154` is unchanged and still correct.

- **Site today:** `<iframe src="https://booking.hospitable.com/widget/<site-uuid>/<property-id>?locale=<locale>">` (`app/components/BookingIframe.tsx`)
- **Export prescribes:** `<script src="https://cdn.hsptb.com/direct-booking-widget/widget-loader.prod.js" data-site-uuid data-property-id data-theme="multi">`

The multi-property search widget (loaded from `app/[locale]/layout.tsx`) still loads
from `hospitable.b-cdn.net`; the export's CDN is `cdn.hsptb.com`. MPS
identifier is `fa52067f-9428-4c2a-8830-b54fd59398ad` — a different UUID from
the site UUID, which is expected.

## Open questions

1. **Four unlisted units.** PA105, SG101, SG201, and 101 Ed 1052 SG are live in
   Hospitable and have photos, but no page. Publish them?
2. **`pineapple-104` metadata.** `maxGuests` is now 2 per Hospitable (and
   `pineapple-101` is 4), but the title "Studio - Comfort" and `sqFt: 720` are
   still copy-paste from when the two shared an ID. Titles and `sqFt` unverified.
   Titles now live in the message catalogs (`units.<slug>.title` in
   `messages/en.json` and `messages/es.json`), not in `units.ts`, which carries
   only `titleKey` — a title correction has to be made in both catalogs.
3. **`bedrooms` for studios.** Hospitable's public booking API reports no bedroom
   count, so `bedrooms` is derived from the listing name. The seven studios read
   `0`. Machine-readable markup no longer publishes that value: `lib/structuredData.ts`
   omits `numberOfBedrooms`, and the unit page omits the bedroom keyword, whenever
   `bedrooms` is `0` or the unit's category disagrees. Only the visible specs line still
   renders "0 bedrooms" — cosmetic, not a data bug.
4. **Embed migration.** Move to the script loader, or keep the iframe (which
   also carries the checkin/checkout/guest query-param forwarding and the
   widget-language handshake — see AGENTS.md)?

## Photo library defects

- `Fotos unidad 104 PA` — 3 files named `... 01 null.jpg`, `02 null.jpg`,
  `03 null.jpg`. Room metadata missing from the export.
- `Fotos unidad 105 PA/2536 Pineapple Ave - Web Quality - 016 - 15 Bathroom-1.jpg`
  is **1500x2250** (portrait). The other 128 are 1500x1000. Will break a
  uniform grid.
- The `2536 Pineapple Ave` shoot was delivered as two merged exports: sequence
  numbers 001–027 each occur twice, the second copy suffixed `-1`. All are
  distinct images — the `-1` is a filename collision artifact, not a duplicate.
- Frames missing from the library: shoot `2456` is missing 003, 005, 006, 018;
  shoot `2536` is missing 029, 039.
