import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Navbar from "../../components/Navbar";
import ReviewSubmissionForm from "../../components/ReviewSubmissionForm";
import ReviewStatsSection from "../../components/ReviewStatsSection";
import ReviewsDisplay from "../../components/ReviewsDisplay";
import Footer from "../../components/Footer";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.reviews' });
  const tHero = await getTranslations({ locale, namespace: 'reviews.hero' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/reviews`,
      languages: {
        'en': '/en/reviews',
        'es': '/es/reviews'
      }
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `/${locale}/reviews`,
      siteName: "Silver Pineapple",
      images: ["/og-reviews.jpg"],
      type: "website",
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ["/og-reviews.jpg"],
    },
  };
}

export default async function ReviewsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reviews.hero' });

  return (
    <main className="min-h-screen bg-ocean-sunrise">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-coastal-aqua/20 via-coastal-foam/15 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            {t('heading')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subheading')}
          </p>
        </div>
      </section>

      {/* Components */}
      <ReviewSubmissionForm />
      <ReviewStatsSection />
      <ReviewsDisplay />

      <Footer />
    </main>
  );
}
