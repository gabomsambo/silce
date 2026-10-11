/**
 * Hostnames registered on the production Turnstile widget
 * (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` in wrangler.toml). Re-read with:
 * `wrangler turnstile widget get <sitekey>`.
 */
export const REGISTERED_TURNSTILE_WIDGET_HOSTNAMES = [
  "127.0.0.1",
  "localhost",
  "silverpineapple.net",
] as const

/** Production site hostnames accepted from Turnstile verify responses. */
export const PRODUCTION_TURNSTILE_HOSTNAMES = new Set<string>(["silverpineapple.net"])

/** Loopback hostnames registered on the widget for local development. */
export const LOOPBACK_TURNSTILE_HOSTNAMES = new Set<string>(["localhost", "127.0.0.1"])
