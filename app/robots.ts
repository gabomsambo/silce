import type { MetadataRoute } from 'next'

// Required by `output: 'export'`: this file is written out as a static file.
export const dynamic = 'force-static'
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
        '/api/',              // API routes are not pages
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
