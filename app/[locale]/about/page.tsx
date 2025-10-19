// app/[locale]/about/page.tsx
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Navbar from "../../components/Navbar";
import AboutHeroSection from "../../components/AboutHeroSection";
import IntroductionSection from "../../components/IntroductionSection";
import FounderSection from "../../components/FounderSection";
import PhilosophySection from "../../components/PhilosophySection";
import LocationSection from "../../components/LocationSection";
import AboutCTA from "../../components/AboutCTA";
import Footer from "../../components/Footer";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'en': '/en/about',
        'es': '/es/about'
      }
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `/${locale}/about`,
      siteName: "Silver Pineapple",
      images: ["/og-about.jpg"],
      type: "website",
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ["/og-about.jpg"],
    },
  };
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-coastal-mist">
      <Navbar />
      <AboutHeroSection />
      <IntroductionSection />
      <FounderSection />
      <PhilosophySection />
      <LocationSection />
      <AboutCTA />
      <Footer />
    </main>
  );
}
