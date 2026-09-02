"use client"

export const COOKIE_CONSENT_STORAGE_KEY = "silver-pineapple-cookie-consent"
export const COOKIE_CONSENT_UPDATED_EVENT = "silver-pineapple-cookie-consent-updated"

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

function analyticsCookieDomains(hostname: string): string[] {
  const domains = [""]
  const parts = hostname.split(".")

  for (let i = 0; i < parts.length - 1; i += 1) {
    domains.push(`.${parts.slice(i).join(".")}`)
  }

  return domains
}
