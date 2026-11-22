// Replaces what next-intl's middleware did for paths without a locale prefix
// (`/`, `/rooms/...`): pick a locale and redirect. Every other path is a static
// file and never reaches this code (see public/_routes.json), so there is no
// Worker work on a page view.
import { routing } from "../i18n/routing"

type Locale = (typeof routing.locales)[number]

function isLocale(value: string | undefined): value is Locale {
  return (routing.locales as readonly string[]).includes(value ?? "")
}

function cookieLocale(header: string | null): Locale | undefined {
  const match = /(?:^|;\s*)NEXT_LOCALE=([^;]+)/.exec(header ?? "")
  const value = match?.[1]
  return isLocale(value) ? value : undefined
}

/** First supported language in the Accept-Language list, by descending q. */
export function negotiateLocale(acceptLanguage: string | null): Locale | undefined {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";")
      const q = params.map((p) => /^\s*q=([\d.]+)\s*$/.exec(p)?.[1]).find(Boolean)
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q === undefined ? 1 : Number(q), index }
    })
    .filter((entry) => entry.lang && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
  return ranked.map((entry) => entry.lang).find(isLocale)
}

export function localeRedirect(request: Request): Response {
  const url = new URL(request.url)
  const locale =
    cookieLocale(request.headers.get("cookie")) ??
    negotiateLocale(request.headers.get("accept-language")) ??
    routing.defaultLocale
  const path = url.pathname === "/" ? "" : url.pathname
  return new Response(null, {
    status: 307,
    headers: {
      Location: `/${locale}${path}${url.search}`,
      Vary: "Accept-Language, Cookie",
      "Cache-Control": "private, no-store",
    },
  })
}
