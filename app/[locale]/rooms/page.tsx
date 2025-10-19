import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Navbar from "../../components/Navbar";
import RoomsHeroSection from "../../components/RoomsHeroSection";
import RoomsIntroduction from "../../components/RoomsIntroduction";
import AmenityGrid from "../../components/AmenityGrid";
import Footer from "../../components/Footer";

import { CATEGORIES } from "../../data/categories";
import { UNITS } from "../../data/units";
import RoomCategorySection from "../../components/RoomCategorySection";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.rooms' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/rooms`,
      languages: {
        'en': '/en/rooms',
        'es': '/es/rooms'
      }
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `/${locale}/rooms`,
      siteName: "Silver Pineapple",
      images: ["/og-rooms.jpg"],
      type: "website",
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ["/og-rooms.jpg"],
    },
  };
}

export default function RoomsPage() {
  // group units by category
  const grouped = Object.values(CATEGORIES).map(cat => ({
    cat,
    units: UNITS.filter(u => u.category === cat.key).sort((a,b) => a.priceFrom - b.priceFrom)
  }));

  return (
    <main className="min-h-screen relative">
      {/* Background image with opacity */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(/dolphin.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content wrapper with gradient overlay */}
      <div className="relative z-10 bg-gradient-to-b from-tropical-waters/95 via-tropical-waters/90 to-tropical-waters/95">
        <Navbar />
        <RoomsHeroSection />
        <RoomsIntroduction />

        {/* Category sections */}
        {grouped.map(({ cat, units }) => (
          units.length > 0 && (
            <RoomCategorySection key={cat.key} category={cat} units={units} />
          )
        ))}

        <AmenityGrid />
        <Footer />
      </div>
    </main>
  );
}
