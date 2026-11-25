// Facts behind /[locale]/privacy. Every entry is traced to code or an observed
// request in docs/privacy-policy-evidence.md; the display copy for each item lives in
// the catalogs under privacy.storage.items.<id>.

export const PRIVACY_POLICY_UPDATED = "2026-11-25"

// Privacy policies of the services that process bookings and payments. The site links
// to them rather than restating their retention periods.
export const THIRD_PARTY_POLICIES = {
  hospitable: "https://hospitable.com/legal/privacy-policy",
  stripe: "https://stripe.com/privacy",
  airbnb: "https://www.airbnb.com/help/article/3175",
} as const

export type StorageKind = "cookie" | "localStorage" | "sessionStorage"

export interface BrowserStorageItem {
  id: string
  // Literal cookie / storage key names as they appear in the browser.
  names: string
  kinds: StorageKind[]
  setBy: string
}

// Must match COOKIE_CONSENT_STORAGE_KEY in app/components/cookieConsent.ts; that module
// is client-only, so a server component cannot import the constant from it.
export const CONSENT_STORAGE_KEY = "silver-pineapple-cookie-consent"

export const BROWSER_STORAGE_ITEMS: BrowserStorageItem[] = [
  { id: "consent", names: CONSENT_STORAGE_KEY, kinds: ["localStorage"], setBy: "Silver Pineapple" },
  { id: "locale", names: "NEXT_LOCALE", kinds: ["cookie"], setBy: "Silver Pineapple" },
  { id: "analytics", names: "_ga, _ga_<id>, _gid, _gat", kinds: ["cookie"], setBy: "Google Analytics" },
  { id: "turnstile", names: "cf.turnstile.u", kinds: ["localStorage"], setBy: "Cloudflare Turnstile" },
  { id: "hospitableLanguage", names: "translation_language", kinds: ["cookie"], setBy: "Hospitable" },
  {
    id: "hospitableAnalytics",
    names: "ph_phc_…_posthog, ph_phc_…_window_id, ph_phc_…_primary_window_exists",
    kinds: ["cookie", "localStorage", "sessionStorage"],
    setBy: "Hospitable (PostHog)",
  },
  { id: "hospitableReplay", names: "sentryReplaySession", kinds: ["sessionStorage"], setBy: "Hospitable (Sentry)" },
  {
    id: "hospitableCheckout",
    names: "hospitable_ga_begin_checkout_<quote>",
    kinds: ["sessionStorage"],
    setBy: "Hospitable (Google Analytics)",
  },
  { id: "stripeCookie", names: "m", kinds: ["cookie"], setBy: "Stripe" },
  { id: "stripeFraud", names: "__stripe_mid, __stripe_sid", kinds: ["cookie"], setBy: "Stripe" },
  { id: "stripeSession", names: "_ab, _mf, id", kinds: ["sessionStorage"], setBy: "Stripe" },
  { id: "fontsBotCheck", names: "__cf_bm", kinds: ["cookie"], setBy: "cdn.fonts.net (Cloudflare)" },
]
