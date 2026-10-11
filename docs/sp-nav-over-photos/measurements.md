# Nav pixel contrast — sp-nav-over-photos

Method: freeze transitions, transparent text, viewport screenshot, sample pixel at each navbar text node centre. After scroll, dispatch `scroll` and wait 450ms so `isScrolled` settles.

**Sample count:** 78 navbar text nodes across home, about, unit-2528 (en/es), desktop + mobile viewports, scrolled and unscrolled.

## Failing nodes before fix (`via-coastal-mist/5`)

| Page | Viewport | Scroll | Label | Measured | Backdrop pixel | Min |
|------|----------|--------|-------|----------|----------------|-----|
| /en | 1440×900 | 600 | ABOUT | 3.18:1 | rgb(90,107,111) | 4.5 |
| /es | 1440×900 | 600 | INICIO | 2.88:1 | rgb(64,102,123) | 4.5 |
| /es | 1440×900 | 600 | ALOJAMIENTOS | 4.08:1 | rgb(109,123,135) | 4.5 |
| /es/about | 1440×900 | 400 | INICIO | 3.22:1 | rgb(77,113,86) | 4.5 |
| /en | 390×844 | 600 | PINEAPPLE (logo) | 1.91:1 | rgb(146,160,168) | 3.0 |
| /en/about | 390×844 | 400 | PINEAPPLE (logo) | 1.80:1 | rgb(146,155,151) | 3.0 |

Prior gradient sweep (2026-09-05) on `/en/about` with see-through bar: HOME **4.24:1**, ROOMS **4.09:1** (needs 4.5).

## After fix (`via-coastal-mist` opaque)

Same 78 samples, **0 below AA**.

Driver: `firstmate/data/sp-nav-over-photos/nav-pixel-audit.py` (run outside worktree).
