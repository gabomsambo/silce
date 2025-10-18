import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverpineapple.net'

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
