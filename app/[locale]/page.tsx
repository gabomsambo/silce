import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import DiscoverLocationSection from "../components/DiscoverLocationSection";
import EnhancedGuestExperiences from "../components/EnhancedGuestExperiences";
import BoutiqueNewsletterSignup from "../components/BoutiqueNewsletterSignup";
import InstagramFeed from "../components/InstagramFeed";
import Footer from "../components/Footer";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  // CRITICAL: MUST await params in Next.js 15
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'es': '/es'
      }
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `/${locale}`,
      siteName: "Silver Pineapple",
      images: ["/og-home.jpg"],
      type: "website",
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ["/og-home.jpg"],
    },
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-ocean-sunrise">
      <Navbar />
      <Hero />
      <Introduction />
      <DiscoverLocationSection />
      {/* <EnhancedGuestExperiences /> */}
      <BoutiqueNewsletterSignup />
      {/* <InstagramFeed /> */}
      <Footer />
    </main>
  );
}
