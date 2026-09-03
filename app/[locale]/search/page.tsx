import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import PropertySearchWidget from "../../components/PropertySearchWidget"

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.search" })

  return {
    title: t("title"),
    description: t("description"),
    // ── REMOVE WHEN PROPERTIES ARE ATTACHED TO THE MPS WIDGET ──
    // The Hospitable multi-property search returns an empty set for every query
    // (dashboard-side configuration, not a bug in this repo — see the note in
    // app/components/PropertySearchWidget.tsx). A page that answers nothing has
    // no business in the index, so it is excluded until it can. `follow` stays
    // on so the links out of it still carry weight. Drop this `robots` block and
    // the notice panel in PropertySearchWidget together, and in the same pass
    // update or remove the `/search` bullet in AGENTS.md (it carries a dated
    // "returns []" claim) and the before/after screenshots in docs/evidence/search/.
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true }
    },
    alternates: {
      canonical: `/${locale}/search`,
      languages: {
        en: "/en/search",
        es: "/es/search",
        "x-default": "/en/search"
      }
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `/${locale}/search`,
      siteName: "Silver Pineapple",
      images: ["/og-rooms.jpg"],
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US"
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/og-rooms.jpg"]
    }
  }
}

export default async function SearchPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "search" })

  return (
    <main className="min-h-screen bg-coastal-mist">
      <Navbar />

      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("heading")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <PropertySearchWidget />
        </div>
      </section>

      <Footer />
    </main>
  )
}
