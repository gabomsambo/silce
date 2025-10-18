import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import GoogleAnalytics from './components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Silver Pineapple | Boutique Short-Term Rentals in Melbourne, FL',
    template: '%s | Silver Pineapple'
  },
  description: 'Discover boutique short-term rentals in Eau Gallie, Melbourne FL. Steps from the arts district, 10 minutes to beaches. Renovated units with parking and laundry.',
  keywords: ['short-term rental', 'Melbourne FL', 'Eau Gallie', 'vacation rental', 'boutique accommodations', 'beach vacation', 'Florida rentals'],
  authors: [{ name: 'Silver Pineapple LLC' }],
  creator: 'Silver Pineapple',
  publisher: 'Silver Pineapple',
  metadataBase: new URL('https://silverpineapple.net'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://silverpineapple.net',
    siteName: 'Silver Pineapple',
    title: 'Silver Pineapple | Boutique Short-Term Rentals in Melbourne, FL',
    description: 'Boutique short-term rentals in Eau Gallie. Steps from arts district, minutes to beaches.',
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
    title: 'Silver Pineapple | Boutique Short-Term Rentals',
    description: 'Boutique rentals in Melbourne FL. Arts district location, beach access.',
    images: ['/og-home.jpg'],
  },
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
      <body>{children}</body>
    </html>
  )
}
