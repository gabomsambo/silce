import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import GoogleAnalytics from '../components/GoogleAnalytics';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // CRITICAL: MUST await params in Next.js 15
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.global' });

  return {
    metadataBase: new URL('https://silverpineapple.net'),
    authors: [{ name: 'Silver Pineapple LLC' }],
    creator: 'Silver Pineapple',
    publisher: 'Silver Pineapple',
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate')
    },
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url: 'https://silverpineapple.net',
      siteName: 'Silver Pineapple',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [
        {
          url: '/og-home.jpg',
          width: 1200,
          height: 630,
          alt: 'Silver Pineapple Rentals in Melbourne, FL'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ['/og-home.jpg'],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'x-default': '/en'
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // CRITICAL: MUST await params in Next.js 15
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <script src="https://hospitable.b-cdn.net/direct-property-search-widget/hospitable-search-widget.prod.js"></script>
        <GoogleAnalytics />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
