# Units — Source of Truth

Reconciles three systems: **Hospitable** (`booking-widget-codes.md` export),
the **photo library** (`Fotos de todas las unidades/`), and the **site**
(`app/data/units.ts`).

Last reconciled: 2026-09-04.

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

## Photo provenance — how to decide which unit a photo shows

**Neither the source folder name nor the street-address prefix in a filename is
reliable evidence of which apartment a photo shows.** Both have been used to
argue provenance here and both produced wrong answers: 3 of the 13 unit folders
(`101 PA`, `102 SG`, `105 PA`) mix files from two address prefixes, and the
`2536 Pineapple Ave` prefix appears in folders for units in a different
building. Sequence numbers also collide between merged exports.

The authoritative check is **Hospitable's own per-listing photo set**:

```
https://api.hospitable.com/bookings/api/properties/<id>  ->  data.photos[].xx_large
```

That is the same listing ID the booking widget books against, so those images
are provenance-tied by definition — they are what the guest already sees at
checkout. Compare a candidate file to that listing's set with a perceptual hash
(16x16 dHash, 256-bit); a distance `<= 6` means the same photograph, and
unrelated frames land above 100, so the gap is unambiguous.

**A photo ships only if it is the same photograph as one in its own listing's
official set.** Unresolved provenance is not permission to publish. Applying
that rule dropped four committed files — `photos_105/8.jpg` and `11.jpg` and
`photos_seagrape_1052_101/1.jpg` (no match in their own listing), and
`photos_105/10.jpg` (matches official #08, but so does the retained `6.jpg` —
same photograph twice).

## Master table — 13 properties

Hospitable is authoritative for IDs. All 13 map 1:1 to a photo folder.

`Library` counts files in the source folder; `Live` counts entries in that
unit's `images` array in `units.ts`. They are allowed to differ — only the four
units published in 2026-09 draw on the professional library at all, and their
galleries are filtered by the provenance rule above.

| # | Hospitable property | ID | Photo folder | Site slug | Library | Live |
|---|---|---|---|---|--:|--:|
| 1 | Unit PA101 Ed 2546 | `2282914` | Fotos unidad 101 PA | `pineapple-101` | 6 | 10 |
| 2 | Unit PA102 Ed 2546 | `2282915` | Fotos unidad 102 PA | `pineapple-102` | 5 | 9 |
| 3 | Unit PA103 Ed 2546 | `2282916` | Fotos unidad 103 PA | `pineapple-103` | 5 | 8 |
| 4 | Unit PA104 Ed 2546 | `2282923` | Fotos unidad 104 PA | `pineapple-104` | 11 | 5 |
| 5 | Unit PA105 Ed 2546 | `2282917` | Fotos unidad 105 PA | `pineapple-105` | 11 | 8 |
| 6 | Unit PA2526 | `2282928` | Fotos unidad 2526 PA | `unit-2526` | 8 | 8 |
| 7 | Unit PA2528 | `2282925` | Fotos unidad 2528 PA | `unit-2528` | 8 | 10 |
| 8 | Unit PA2536 | `2282918` | Fotos unidad 2536 PA | `unit-2536` | 5 | 8 |
| 9 | Unit PA2538 | `2282919` | Fotos unidad 2538 PA | `unit-2538` | 5 | 12 |
| 10 | Unit SG101 Ed 1042 | `2282921` | Fotos unidad 101 SG | `sea-grape-101` | 5 | 5 |
| 11 | Unit SG102 Ed 1042 | `2282920` | Fotos unidad 102 SG | `sea-grape-102` | 7 | 14 |
| 12 | Unit SG201 ED 1042 | `2282922` | Fotos unidad 201 SG | `sea-grape-201` | 5 | 5 |
| 13 | Unit 101 Ed 1052 SG | `2282929` | Fotos unidad 101 1052 SG | `sea-grape-1052-101` | 10 | 9 |

Only rows 5, 10, 12 and 13 have `public/photos*` folders sourced from the
library; the other nine ship unrelated pre-existing photo sets that share no
files with it.

Non-unit folders: `Fotos amenidades` (15), `Fotos de exterior` (23).
Library total: **129 files, all byte-distinct** (checksummed). Byte-distinct is
not the same as visually distinct — see the merged-export note under *Photo
library defects*.

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

## Bed configuration

`bedType` in `units.ts` is a guest-facing sleeping-surface claim and needs a
positive source, the same test applied to amenity chips and to photo
provenance. The public booking API is **not** that source: `.../properties/<id>`
returns `name`, `max_guests`, check-in times and house rules and no bed or
amenity data at all (re-checked 2026-09-04 against `2282920` and `2282921`).
The only authority is Hospitable's own per-listing sleeping arrangement in the
reconciliation export. Never derive a bed from `max_guests`, from a photograph,
or from what the site already says.

Two units were corrected under that rule, both direct contradictions of the
export rather than mere gaps:

- `sea-grape-102` (`2282920`, export row `Unit SG102 Ed 1042`) advertised
  `Queen + Queen + Sofa Bed`, while the export gives it 2 beds — "1 queen in
  bedroom; 1 queen in bedroom" — and no sofa bed. It now reads `Queen + Queen`,
  matching `sea-grape-101` (`2282921`), the other 6-guest two-bedroom it
  renders beside on the rooms index. `max_guests` is unchanged at 6; it comes
  from Hospitable and is authoritative regardless of how the beds are counted.
  That leaves the two sources disagreeing in public — open question 1 below.
- `unit-2538` (`2282919`, live name "Minimalist Studio | Wifi + Arts Scene &
  Near River" = export row `Unit PA2538`) advertised `King`, while the export
  gives it "1 queen in living room; 1 sofa bed in living room". Worse than the
  sea-grape-102 case: it both invented a bed and downgraded on arrival anyone
  who booked expecting a king. It now reads `Queen + Sofa Bed`, the wording
  `pineapple-105` and `sea-grape-1052-101` already use for that same
  arrangement.

**The rule is not yet fully applied.** Six more pre-existing units fail it and
are listed under open questions 3–5; they are deferred to the systematic
bed-and-content pass, which inherits that list. Do not close any of these gaps
by inventing a bed — the authorities are what they are, and the site states
each one where it is sourced.

## Open questions

1. **Both two-bedroom units advertise 6 guests and name beds for 4.**
   `sea-grape-101` (`2282921`) and `sea-grape-102` (`2282920`) each carry
   `maxGuests: 6` from Hospitable and `bedType: "Queen + Queen"` from the
   reconciliation export, which lists 2 beds for each. A party of six sees no
   sleeping arrangement for the last two on the rooms index ("Sleeps 6" over
   "2 Queen beds") or on the detail page. Both figures are sourced, so neither
   can be edited here: only the owner can say what those two guests sleep on —
   a third bed the export omits, or a `max_guests` that overstates the unit.
   Resolve it there, then correct whichever field is wrong.
2. **`sea-grape-102` `sqFt` and `extras`.** `sqFt: 520` and
   `extras: ["Dining table in kitchen"]` are pre-existing and unsourced; no
   repo document or API response asserts either. The extras string is a kitchen
   claim, and it renders on the featured card one line below the
   `two-bed-1-bath` header the "Full kitchen" chip was removed from as
   unsourced. Both stay in `units.ts`: silence is not contradiction, and
   removing a possibly-true fact a guest values has a real cost of its own.
   Sourcing them is deferred to the systematic bed-and-content pass.
   `sea-grape-101` carries neither field, so the inconsistency is visible on
   the same section.
3. **`pineapple-101` bed configuration.** `units.ts` says `Queen`; the
   reconciliation export says "1 double in living room; 1 sofa bed in living
   room". Both cannot be right, and neither is confirmable against the public
   API. Left as-is rather than swapped for a second unverified claim; deferred
   to the systematic bed-and-content pass, which resolves it against
   Hospitable's listing data.
4. **Two units understate their beds.** `unit-2536` (`2282918` = `PA2536`) and
   `pineapple-103` (`2282916` = `PA103`) both say `Queen`, where the export
   gives each 2 beds — "1 queen …; 1 sofa bed …". Safe understatements rather
   than false claims, so nothing here misleads a guest on arrival. Deferred to
   the systematic bed-and-content pass.
5. **Three units assert a bed type the export calls unknown.** `pineapple-104`
   (`2282923`), `unit-2528` (`2282925`) and `unit-2526` (`2282928`) all display
   `Queen`, where the export holds the bed *count* authoritative but records
   the *type* as genuinely unknown and instructs "Do not invent one". The site
   is inventing a bed type on three units — a real defect against the rule
   above, not a gap. Correcting three more displayed bed types belongs to the
   systematic bed-and-content pass, which inherits this list.
6. **`pineapple-104` metadata.** `maxGuests` is now 2 per Hospitable (and
   `pineapple-101` is 4), but the title "Studio - Comfort" and `sqFt: 720` are
   still copy-paste from when the two shared an ID. Titles and `sqFt` unverified.
   Titles now live in the message catalogs (`units.<slug>.title` in
   `messages/en.json` and `messages/es.json`), not in `units.ts`, which carries
   only `titleKey` — a title correction has to be made in both catalogs.
7. **`bedrooms` for studios.** Hospitable's public booking API reports no bedroom
   count, so `bedrooms` is derived from the listing name. The seven studios read
   `0`. Machine-readable markup no longer publishes that value: `lib/structuredData.ts`
   omits `numberOfBedrooms`, and the unit page omits the bedroom keyword, whenever
   `bedrooms` is `0` or the unit's category disagrees. Visible specs and descriptions
   render "Studio" / "Estudio" while preserving the authoritative numeric value.
8. **Embed migration.** Move to the script loader, or keep the iframe (which
   also carries the checkin/checkout/guest query-param forwarding and the
   widget-language handshake — see AGENTS.md)?

## Photo library defects

- `Fotos unidad 104 PA` — 3 files named `... 01 null.jpg`, `02 null.jpg`,
  `03 null.jpg`. Room metadata missing from the export.
- `Fotos unidad 105 PA/2536 Pineapple Ave - Web Quality - 016 - 15 Bathroom-1.jpg`
  is **1500x2250** (portrait). The other 128 are 1500x1000. Will break a
  uniform grid.
- The `2536 Pineapple Ave` shoot was delivered as two merged exports: sequence
  numbers 001–027 each occur twice, the second copy suffixed `-1`. The two
  copies are byte-distinct (different JPEG renders) but **visually identical**,
  so a checksum comparison does not catch them — only a perceptual hash does.
  Do not try to pair them by filename; run the provenance check above, which
  catches both the duplication and the misfiling in one pass.
- Frames missing from the library: shoot `2456` is missing 003, 005, 006, 018;
  shoot `2536` is missing 029, 039.
