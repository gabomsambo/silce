"use client"

import { useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

// The multi-property search widget Hospitable gives us. `type="custom"` is the
// self-hosted-site flavour; the identifier is the Direct site's MPS widget.
const MPS_IDENTIFIER = "fa52067f-9428-4c2a-8830-b54fd59398ad"

// Languages the widget bundle actually ships. Anything else makes it log a
// warning and fall back to English, so don't hand it a bare region code.
const WIDGET_LANGUAGES = ["en", "fr", "es", "de"]

declare global {
  interface Window {
    currentLocale?: string
    setMPSLanguage?: (language: string) => void
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hospitable-direct-mps": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        identifier: string
        type: string
        "results-url"?: string
        "full-screen-mode"?: string
      }
    }
  }
}

export default function PropertySearchWidget() {
  const locale = useLocale()
  const t = useTranslations("search")

  useEffect(() => {
    // Belt and braces alongside the boot-time `window.currentLocale` set in the
    // layout: that inline script does not re-run on a client-side locale switch,
    // and `setMPSLanguage` is only defined once the widget bundle has booted, so
    // poll briefly rather than assuming it is there on first paint.
    if (!WIDGET_LANGUAGES.includes(locale)) return

    let attempts = 0
    const applyLanguage = () => {
      if (typeof window.setMPSLanguage === "function") {
        window.setMPSLanguage(locale)
        return true
      }
      return false
    }

    if (applyLanguage()) return

    const timer = setInterval(() => {
      attempts += 1
      if (applyLanguage() || attempts > 20) clearInterval(timer)
    }, 250)

    return () => clearInterval(timer)
  }, [locale])

  return (
    <>
      {/*
        Rendered as a real element rather than through `dangerouslySetInnerHTML`.
        `full-screen-mode="false"` is a documented widget input (Angular Elements
        dash-cases `fullScreenMode`); without it the widget reserves a viewport-tall
        block and an empty result set reads as a large silent void.
      */}
      <hospitable-direct-mps
        identifier={MPS_IDENTIFIER}
        type="custom"
        full-screen-mode="false"
      />

      {/*
        ── REMOVE WITH THE `noindex` IN app/[locale]/search/page.tsx ──
        The widget's availability search currently returns an empty set for every
        query — verified against the API directly, including a query with no date
        constraint, while the same properties are available and priced through the
        per-unit booking widget. The properties are not attached to this MPS widget
        on the Hospitable side, which is a dashboard fix, not a code one.

        Until that is done the widget renders an empty results area with no message
        of its own, so this panel is what stops the page being a dead end. When
        properties are attached, delete this notice and the `robots: noindex` in the
        page's metadata together — see docs/UNITS-SOURCE-OF-TRUTH.md for the IDs — and
        in the same pass update or remove the `/search` bullet in AGENTS.md (it carries
        a dated "returns []" claim) and the screenshots in docs/evidence/search/.
      */}
      <div className="mt-10 rounded-2xl border border-tan/30 bg-white/80 p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          {t("unavailableHeading")}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          {t("unavailableBody")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/rooms"
            className="bg-tan hover:bg-tan/90 text-primary font-semibold py-4 px-8 rounded-xl transition-all duration-300"
          >
            {t("browseAll")}
          </Link>
          <a
            href="mailto:silverpineapplehosto@gmail.com"
            className="bg-white border-2 border-tan-ink text-tan-ink hover:bg-tan hover:text-primary font-semibold py-4 px-8 rounded-xl transition-all duration-300"
          >
            {t("contactUs")}
          </a>
        </div>
      </div>
    </>
  )
}
