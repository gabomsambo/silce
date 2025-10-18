import type { MetadataRoute } from 'next'
import { UNITS } from './data/units'

// CRITICAL: Force static generation in Next.js 15
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://silverpineapple.net'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Dynamic property pages (9 units from UNITS array)
  const propertyPages: MetadataRoute.Sitemap = UNITS.map((unit) => ({
    url: `${baseUrl}/rooms/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,  // High priority - conversion pages
  }))

  return [...staticPages, ...propertyPages]
}
