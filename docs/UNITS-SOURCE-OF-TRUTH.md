# Units — Source of Truth

Reconciles three systems: **Hospitable** (`booking-widget-codes.md` export),
the **photo library** (`Fotos de todas las unidades/`), and the **site**
(`app/data/units.ts`).

Last reconciled: 2026-09-12.

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
unit's `images` array in `units.ts`. Live galleries for all 13 units are the
listing's own Hospitable photo set, upgraded to library files where a 16x16
dHash matches (distance ≤ 6), ordered interior walkthrough → amenities →
exterior/location, and encoded as WebP at 640 / 1024 / 1500 because Cloudflare
Pages does not run Next's optimizer. A unit's own best interior always leads;
Hospitable's lead is not inherited when it is a shared amenity or location
frame (2282921 / 2282922 open on a beach shot; 2282917 opens on the
stone-table patio). `sea-grape-1052-101` (`2282929`) has no sunset / downtown
/ marina frames in its official set, so its tail is that listing's own
laundry, stone-table, and building photos rather than the shared location
set used on the other twelve.

| # | Hospitable property | ID | Photo folder | Site slug | Library | Live |
|---|---|---|---|---|--:|--:|
| 1 | Unit PA101 Ed 2546 | `2282914` | Fotos unidad 101 PA | `pineapple-101` | 6 | 11 |
| 2 | Unit PA102 Ed 2546 | `2282915` | Fotos unidad 102 PA | `pineapple-102` | 5 | 11 |
| 3 | Unit PA103 Ed 2546 | `2282916` | Fotos unidad 103 PA | `pineapple-103` | 5 | 11 |
| 4 | Unit PA104 Ed 2546 | `2282923` | Fotos unidad 104 PA | `pineapple-104` | 11 | 13 |
| 5 | Unit PA105 Ed 2546 | `2282917` | Fotos unidad 105 PA | `pineapple-105` | 11 | 13 |
| 6 | Unit PA2526 | `2282928` | Fotos unidad 2526 PA | `unit-2526` | 8 | 12 |
| 7 | Unit PA2528 | `2282925` | Fotos unidad 2528 PA | `unit-2528` | 8 | 13 |
| 8 | Unit PA2536 | `2282918` | Fotos unidad 2536 PA | `unit-2536` | 5 | 11 |
| 9 | Unit PA2538 | `2282919` | Fotos unidad 2538 PA | `unit-2538` | 5 | 11 |
| 10 | Unit SG101 Ed 1042 | `2282921` | Fotos unidad 101 SG | `sea-grape-101` | 5 | 11 |
| 11 | Unit SG102 Ed 1042 | `2282920` | Fotos unidad 102 SG | `sea-grape-102` | 7 | 13 |
| 12 | Unit SG201 ED 1042 | `2282922` | Fotos unidad 201 SG | `sea-grape-201` | 5 | 11 |
| 13 | Unit 101 Ed 1052 SG | `2282929` | Fotos unidad 101 1052 SG | `sea-grape-1052-101` | 10 | 13 |

Rows 5, 10, 12 and 13 still source their unit interiors from the library;
their amenity and exterior tails now come from that listing's Hospitable set
(library files where they match). The other nine keep the pre-existing
interior sets they shipped on 2026-09-06 and share the same amenity /
exterior WebPs where those frames appear in the listing.

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
every value below the true floor advertises a rate no guest can book. All
thirteen match their live floor exactly, re-derived against that endpoint on
2026-09-05 and re-confirmed 2026-09-06.

**Read `available`, not just `price`, and treat the floor as perishable.** The
endpoint returns a `price` for nights that cannot be booked at all, and those
nights can be cheaper than anything on sale. Ask for 24 months on `2282918` and
128 nights come back under 75 — as low as **65** — every one of them from
2028-05-01 onward and every one `available: false` with `has_reservation: false`:
not booked by a guest, but outside the owner's open booking window entirely.
Its bookable window on 2026-09-06 ran 2026-09-13 → 2027-09-04, and across the
full 24 months the minimum among **bookable** nights was **75**, with none below.
So a `priceFrom` derived from `price` alone would have published a rate nobody
could book, in the opposite direction from the error it is meant to prevent.
Those far-future figures look like an unseasoned base rate sitting behind a
window that has not been opened yet, which gives every value here a shelf life:
**if a later window opens without seasonal rates, the true floor drops and
`priceFrom` has to follow.** Re-derive whenever the booking window extends, and
note that the endpoint does not cap the range — it returns exactly the window
asked for, so a short answer means a short question, not a page limit.

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

Sofa-bed claims are restricted to what the owner stated on 2026-09-05 (twice)
and to those two listings only:

- `sea-grape-102` (`2282920`) and `sea-grape-101` (`2282921`): owner-stated
  sofa beds. They read `Queen + Queen + Sofa Bed`. `sea-grape-201` has none.
  Listing captions on 2026-09-06 also name a sofa bed on `sea-grape-102`
  ("Two queen bedrooms plus a sofa bed…"). That agrees with the owner; it is
  not an independent grant to publish sofa beds elsewhere.
- A sofa is not a sofa bed — armchair / sofa / "sleeper sofa" caption copy is
  not enough. Captions that named a sofa bed on `pineapple-101` / `pineapple-102`
  conflict with the owner's standing decision, so those sofa beds stay off
  the site. Understatement is the rule where sources conflict.
- `unit-2538` (`2282919`, live name "Minimalist Studio | Wifi + Arts Scene &
  Near River" = export row `Unit PA2538`) once advertised `King`. The export
  gives it a queen in the living room. It now reads `Queen` only: the king was
  invented, and the export's sofa bed is not owner-stated.

**Applied 2026-09-06 against the owner override and live listing names** (the
public API still has no bed-type field). Sofa beds on Sea Grape 101 and 102
are owner-stated. Sea Grape 201 has none. Listing names/captions source a
queen on `pineapple-104` and `unit-2528`, a full bed on `unit-2526` and
`pineapple-101`, and a queen on `pineapple-103` ("Queen Bed"). `unit-2536`
stays Queen — the export's sofa bed is not owner-stated, and an armchair is
not a sofa bed. Pre-existing `Queen + Sofa Bed` strings on `unit-2538`,
`pineapple-105` and `sea-grape-1052-101` were dropped for the same reason.

## Per-unit listing content

`app/data/hospitable-units.json` is the owner-supplied structured Hospitable
snapshot for unit-page summaries, descriptions, amenities, room details,
coordinates and house rules. `app/data/hospitableContent.ts` joins it to the
site by property ID and owns the reconciliation overrides; unit pages do not
fetch or revalidate this content at runtime. Spanish narratives live in the
paired `app/data/hospitable-unit-content.es.json` snapshot.

Owner classification overrides imported kitchen and bedding wording. Full
kitchens are limited to `pineapple-102`, `sea-grape-102` and
`sea-grape-1052-101`; `unit-2528` is a kitchenette, and no other unit may gain a
positive full-kitchen claim from raw listing prose or amenity tokens. Sofa beds
remain limited to Sea Grape 101 and 102 as described above. Laundry is published
as paid, coin-operated and on-site, without an amount.

Square footage is restored only when the unit's own listing summary or
description states it. The parser retains whether the source used `~`, and the
English and Spanish displays preserve that approximate-versus-exact distinction.

## Category amenity chips

Chips on the rooms-index category headers are guest-facing claims and take the
same positive-source test as bed types. Removed as unsourced: the "Full
kitchen" chip on `two-bed-1-bath`, the "Kitchenette" chips on `studio-compact`
and `studio-comfort`, and the "Queen bed" chips on `studio-compact`,
`studio-comfort` and `studio-plus`. Kept, because a source asserts them:
`queenBed` on `one-bed-1-bath`, `twoBedrooms` on `two-bed-1-bath`, and the
category `sleeps` counts, which are derived from `max_guests` on the units in
each category.

`studio-plus` is the one partial case. Its chip read "Kitchenette + dining
table" and its blurb claimed "a dedicated dining nook in the kitchen". The
kitchenette half **is** sourced — `pineapple-101`'s live listing name is
"Stylish Studio Apt w/ Kitchenette + River Views" — while nothing sources the
dining table: `pineapple-101` carries no `extras`, and the only "Dining table
in kitchen" string in the repo belongs to `sea-grape-102` (open question 2).
The chip was therefore narrowed to the plain `kitchenette` label rather than
dropped, and the dining-nook clause removed from the blurb in both catalogs;
the now-orphaned `kitchenetteDiningTable` key was deleted from `en.json` and
`es.json`.

## Open questions

1. **Capacity exceeds the beds on at least three units.** This is a pattern,
   not a set of one-off curiosities: the guest count Hospitable accepts is
   higher than the sleeping surfaces the reconciliation export lists.
   - `sea-grape-101` (`2282921`) and `sea-grape-102` (`2282920`):
     `maxGuests: 6` over 2 queens. The rooms index shows "Sleeps 6" above
     "2 Queen beds".
   - `sea-grape-201` (`2282922`): `maxGuests: 4` over 1 queen. The unit page
     title chips and facts cards still publish both numbers (Spanish:
     "4 personas" / "4 huéspedes" next to "1 habitación" and "Cama Queen").

   On every one of them both numbers are the owner's own — `max_guests` from
   Hospitable, the bedding from the export — so neither side can be edited
   here. Only the owner can say what the extra guests sleep on; the question is
   already filed with him and has been broadened to name `sea-grape-201`. The
   position this repo takes: publish his numbers, refuse to invent beds to make
   them add up, and put the discrepancy in front of him.
2. **`sea-grape-102` `extras`.** `extras: ["Dining table in kitchen"]` is
   pre-existing and unsourced; no repo document or API response asserts it. The
   extras string is a kitchen claim. It still renders on the rooms-index
   featured card one line below the `two-bed-1-bath` header the "Full kitchen"
   chip was removed from as unsourced. It stays in `units.ts`: silence is not
   contradiction, and removing a possibly-true fact a guest values has a real
   cost of its own. Sourcing it is deferred to a systematic category-card pass.
   Unit pages no longer render `extras`; their unit-specific amenities come from
   the structured Hospitable snapshot described above. Square footage is likewise
   absent unless the unit's own listing copy positively states it.
3. *(resolved 2026-09-06 as an understatement)* **`pineapple-101` bed
   configuration.** The previous site carried `Queen ` (trailing space). The
   live listing caption names a full bed; the public listing name is silent on
   bed size. Full is the smaller claim, so `bedType` is `Full` with **no** sofa
   bed — the caption's sofa bed conflicts with the owner's 2026-09-05 decision
   that sofa beds exist in Sea Grape 101 and 102 only.
4. *(resolved 2026-09-06 as understatements kept)* **`unit-2536` and
   `pineapple-103` sofa beds.** Export gave each a sofa bed. Live captions show
   an armchair on 103 and no sofa bed on 2536. Queen stands; do not invent the
   extra bed.
5. *(resolved 2026-09-06)* **Bed type on `pineapple-104`, `unit-2528`,
   `unit-2526`.** Live captions name a queen on the first two and a full bed on
   2526. The export's "unknown type" is superseded by those captions.
6. **`pineapple-104` metadata.** `maxGuests` is now 2 per Hospitable (and
   `pineapple-101` is 4), but the title "Studio — Comfort" is still copy-paste
   from when the two shared an ID. Its old unverified `sqFt: 720` remains absent;
   square footage is now restored only from the unit's own listing copy.
   Titles now live in the message catalogs (`units.<slug>.title` in
   `messages/en.json` and `messages/es.json`), not in `units.ts`, which carries
   only `titleKey` — a title correction has to be made in both catalogs.
7. **`unit-2536`'s title contradicts its category.** It is filed
   `category: "studio-comfort"` in `units.ts`, while `units.unit-2536.title`
   reads "Studio — Compact · Unit 2536" ("Estudio — Compacto · Unidad 2536" in
   `es.json`). This is guest-visible in both locales: the rooms index sorts each
   category by `priceFrom` and `unit-2536` sorts first in `studio-comfort`, so it
   renders as the large featured card directly beneath the "Studio — Comfort"
   heading. Correcting its `priceFrom` to the live $75 (question 10) did not
   change that: at $75 it ties with the other four in the group and still leads
   on `units.ts` source order — so the price fix does not settle this one.
   Every source was checked and none settles which field is wrong:
   - The public booking API cannot arbitrate — `/bookings/api/properties/2282918`
     returns no `property_type` and no `room_type` field at all. The
     reconciliation report's note about those fields being the real
     classification refers to the authenticated export, not this endpoint.
   - The unit's own listing name, "Eau Gallie Studio w/ Kitchenette | Beach &
     River", carries no compact/comfort signal.
   - Export row `Unit PA2536` gives capacity and bedding only, no tier.
   - This document assigns it no category either.
   - Square footage cannot arbitrate category membership: only values explicitly
     stated in each unit's listing copy are displayed, and those statements do
     not define the site's compact/comfort tiering.

   Resolving it — retitle or refile — is the owner's call, because either
   choice changes how a guest browses and which apartments they compare.
8. **`bedrooms` for studios.** Hospitable's public booking API reports no
   bedroom count (`GET /bookings/api/properties/<id>` has no `bedrooms` field;
   re-checked 2026-09-06). The only bedroom signal is the listing `name`. Eight
   units are named Studio and therefore keep `bedrooms: 0` (not an unsourced
   zero, and not a 1BR — inventing `1` would overstate). They are `unit-2528`,
   `unit-2536`, `unit-2538`, `unit-2526`, `pineapple-103`, `pineapple-104`,
   `pineapple-105`, `pineapple-101`. Guest-visible copy already renders
   "Studio" / "Estudio" via `buildBedroomsSpec`; JSON-LD omits
   `numberOfBedrooms` when the count is ≤ 0. The two-bed heading
   ("2 Bedroom, 1 Bath") is the `two-bed-1-bath` category / Sea Grape 101–102
   titles, whose `bedrooms` values are `2` from those listings' `2BR` names.
   `sea-grape-1052-101`'s listing name is silent on Studio/1BR/2BR; it stays
   `bedrooms: 1` as category agreement, flagged here as listing-name-silent.
9. **Embed migration.** Move to the script loader, or keep the iframe (which
   also carries the checkin/checkout/guest query-param forwarding and the
   widget-language handshake — see AGENTS.md)?
10. *(resolved 2026-09-05 — kept here because question 7 refers to it.)*
    **`unit-2536`'s `priceFrom` sat below its live nightly floor.** `units.ts`
    carried `priceFrom: 65`; `/bookings/api/properties/2282918/calendar` over the
    full 12-month window this document prescribes (2026-09-05 → 2027-09-05, 366
    nights) returns a minimum nightly `price` of **75**, with no night below it.
    The rooms index rendered "$65/night" in both locales, so the advertised
    from-rate was one no date in the next year could be booked at — the guest met
    the real number inside the widget, and the understatement also decided which
    apartment led the "Studio — Comfort" section. Re-deriving all thirteen against
    the same endpoint found this the only mismatch. Corrected to **75** under the
    standing rule that the live API wins over the report — the same rule that made
    `sea-grape-1052-101` 90 rather than the export's 80.
    The owner asked how 75 could be the floor when rates move by season, which is
    the right question and has a two-part answer. Month by month across those 366
    nights, **no month falls below 75**: 2026-09 through 2026-12 and 2027-08
    through 2027-09 bottom out at exactly 75, and 2027-01 through 2027-07 bottom
    out higher, at 84–95. But **65 does reappear** past the 12-month horizon —
    128 nights at 65/66/68/74 from 2028-05-01 on. None is bookable (see the
    `available` note under "Site ID migration"), so 75 stands as the floor a guest
    can actually reach; it is not permanent, and if 2028 opens without seasonal
    rates the correct `priceFrom` becomes lower and this entry reopens.
    It is a pre-existing unit rather than one this change publishes, and it was
    fixed here anyway because an advertised rate the owner cannot honour costs him
    money on every booking it draws; that is a contradiction of his own calendar,
    not an unsourced gap.

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
