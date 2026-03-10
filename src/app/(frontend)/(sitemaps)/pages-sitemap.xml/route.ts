/**
 * Pages sitemap route.
 * Updated to use static known routes + Keystatic project/venture slugs
 * instead of Payload database pages collection.
 */
import { getServerSideSitemap } from 'next-sitemap'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../../../keystatic.config'

export async function GET() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const dateFallback = new Date().toISOString()

  // Known static routes
  const staticRoutes = ['', '/work', '/ventures', '/contact', '/posts'].flatMap((path) => [
    { loc: `${SITE_URL}/en${path}`, lastmod: dateFallback },
    { loc: `${SITE_URL}/sv${path}`, lastmod: dateFallback },
  ])

  try {
    const reader = createReader(process.cwd(), keystaticConfig)

    // Add project and venture detail pages
    const [projectSlugs, ventureSlugs] = await Promise.all([
      reader.collections.projects.list(),
      reader.collections.ventures.list(),
    ])

    const projectRoutes = projectSlugs.flatMap((slug) => [
      { loc: `${SITE_URL}/en/work/${slug}`, lastmod: dateFallback },
      { loc: `${SITE_URL}/sv/work/${slug}`, lastmod: dateFallback },
    ])

    const ventureRoutes = ventureSlugs.flatMap((slug) => [
      { loc: `${SITE_URL}/en/ventures/${slug}`, lastmod: dateFallback },
      { loc: `${SITE_URL}/sv/ventures/${slug}`, lastmod: dateFallback },
    ])

    return getServerSideSitemap([...staticRoutes, ...projectRoutes, ...ventureRoutes])
  } catch {
    return getServerSideSitemap(staticRoutes)
  }
}
