# Favicon pixel proofs

These images document what the Silver Pineapple brand mark actually looks like at
tab sizes. A browser-tab screenshot could not be produced on the build host, so
these are the delivered pixels themselves rather than a picture of a browser.

`public/favicon.ico` is a three-frame ICO (16x16, 32x32, 48x48, each PNG-compressed).
`app/[locale]/layout.tsx` declares it as `sizes="16x16 32x32 48x48"` so a browser
picking a tab icon resolves to one of these frames instead of downscaling
`/icon-512.png`.

| File | What it is |
| --- | --- |
| `mark-16.png` | Byte-identical copy of the **16x16 frame** extracted from `public/favicon.ico`. Purpose-drawn filled house silhouette — thin strokes do not survive at this size. |
| `mark-32.png` | Byte-identical copy of the **32x32 frame** extracted from `public/favicon.ico`. The detailed three-house mark. |
| `mark-16-nearest-256.png` | `mark-16.png` scaled 16x with nearest-neighbour, so every source pixel is a flat 16x16 block. Adds no detail; it only makes the 16px frame readable on screen. |
| `mark-32-nearest-256.png` | Same treatment for `mark-32.png` (8x). |
| `mark-size-proof.png` | Both frames side by side, native size above each magnification, for a single at-a-glance comparison. |

The 48x48 frame has no separate proof here; it is the same detailed mark as the
32x32 frame drawn at higher resolution.

To regenerate or re-verify the extracted frames against the shipped ICO, read the
ICO directory in `public/favicon.ico` and compare each frame's bytes with the
matching `mark-*.png`; they are expected to match exactly.
