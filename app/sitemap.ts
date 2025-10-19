import type { MetadataRoute } from 'next'
import { UNITS } from './data/units'

// CRITICAL: Force static generation in Next.js 15
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://silverpineapple.net'
  const locales = ['en', 'es']

  const allPages: MetadataRoute.Sitemap = []

  // Static pages with locale prefixes
  const staticRoutes = ['', '/rooms', '/about', '/reviews']
  const staticPriorities = [1.0, 0.8, 0.5, 0.6]

  staticRoutes.forEach((route, index) => {
    locales.forEach(locale => {
      allPages.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: staticPriorities[index],
      })
    })
  })

  // Dynamic property pages (9 units × 2 locales = 18 pages)
  UNITS.forEach((unit) => {
    locales.forEach(locale => {
      allPages.push({
        url: `${baseUrl}/${locale}/rooms/${unit.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,  // High priority - conversion pages
      })
    })
  })

  return allPages
}
