"use client"

export const COOKIE_CONSENT_STORAGE_KEY = "silver-pineapple-cookie-consent"
export const COOKIE_CONSENT_UPDATED_EVENT = "silver-pineapple-cookie-consent-updated"

// Only the first-party GA cookies this site sets (_ga, _ga_<id>, _gid, _gat*). Cookies set
// inside the Hospitable booking iframe belong to that origin and are unreachable from here.
const ANALYTICS_COOKIE_PATTERN = /^(_ga($|_)|_gid$|_gat($|_))/

export type CookieConsentChoice = "accepted" | "declined"
export type CookieConsentState = CookieConsentChoice | null

export function readCookieConsent(): CookieConsentState {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    return value === "accepted" || value === "declined" ? value : null
  } catch {
    return null
  }
}

export function writeCookieConsent(choice: CookieConsentChoice) {
  if (typeof window === "undefined") {
    return
  }

  if (choice === "declined") {
    clearAnalyticsCookies()
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice)
  } catch {
    // Ignore storage failures to avoid breaking navigation.
  }

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: choice }))
}

export function clearCookieConsent() {
  if (typeof window === "undefined") {
    return
  }

  clearAnalyticsCookies()

  try {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY)
  } catch {
    // Ignore storage failures to avoid breaking navigation.
  }

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: null }))
}

// Also expires GA cookies left from visits before consent gating existed, so declining
// removes analytics state an earlier visit created rather than leaving it on the domain.
export function clearAnalyticsCookies() {
  if (typeof document === "undefined") {
    return
  }

  const names = document.cookie
    .split(";")
    .map((entry) => entry.split("=")[0].trim())
    .filter((name) => name.length > 0 && ANALYTICS_COOKIE_PATTERN.test(name))

  if (names.length === 0) {
    return
  }

  for (const name of names) {
    for (const domain of analyticsCookieDomains(window.location.hostname)) {
      const domainPart = domain ? `; Domain=${domain}` : ""
      document.cookie = `${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${domainPart}`
    }
  }
}

// GA writes _ga on the registrable domain (".example.com"), and a cookie can only be
// removed by rewriting it with the same Domain attribute - so return host-only ("") plus
// every parent-domain suffix and expire the cookie under each.
function analyticsCookieDomains(hostname: string): string[] {
  const domains = [""]
  const parts = hostname.split(".")

  for (let i = 0; i < parts.length - 1; i += 1) {
    domains.push(`.${parts.slice(i).join(".")}`)
  }

  return domains
}
