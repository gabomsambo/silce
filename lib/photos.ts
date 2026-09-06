/**
 * Cloudflare Pages does not run Next's image optimizer (`images.unoptimized`),
 * so gallery files are pre-generated WebP at 640 / 1024 / 1500. `units.ts`
 * stores the 1500w path (`/photos_<id>/01.webp`); the other two widths are
 * the same stem plus `-640` / `-1024`.
 */
export function cardPhoto(src: string) {
  if (!src.endsWith(".webp")) return src
  return src.replace(/\.webp$/, "-640.webp")
}

export function photoSrcSet(src: string) {
  if (!src.endsWith(".webp")) return undefined
  const stem = src.replace(/\.webp$/, "")
  return `${stem}-640.webp 640w, ${stem}-1024.webp 1024w, ${src} 1500w`
}
