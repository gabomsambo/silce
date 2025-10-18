import type { MetadataRoute } from 'next'

// CRITICAL: Edge runtime required for Cloudflare Pages
export const runtime = 'edge'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Silver Pineapple | Boutique Short-Term Rentals',
    short_name: 'Silver Pineapple',
    description: 'Boutique short-term rentals in Eau Gallie, Melbourne FL. Steps from the arts district, minutes to beaches.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a1a',
    theme_color: '#D2B48C',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
