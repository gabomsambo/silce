"use client"

export const COOKIE_CONSENT_STORAGE_KEY = "silver-pineapple-cookie-consent"
export const COOKIE_CONSENT_UPDATED_EVENT = "silver-pineapple-cookie-consent-updated"

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

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice)
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: choice }))
  } catch {
    // Ignore storage failures to avoid breaking navigation.
  }
}
