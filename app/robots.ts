import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/test-booking',      // Hide test pages from Google
        '/hospitable-config', // Hide config pages from Google
        '/api/',              // Block API routes (if any in future)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
