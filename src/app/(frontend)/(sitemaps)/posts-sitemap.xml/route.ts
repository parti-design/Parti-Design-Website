/**
 * Posts sitemap route.
 * Updated to read posts from Keystatic (filesystem) instead of Payload (database).
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

  try {
    const reader = createReader(process.cwd(), keystaticConfig)
    const slugs = await reader.collections.posts.list()

    const sitemap = slugs.flatMap((slug) => [
      {
        loc: `${SITE_URL}/en/posts/${slug}`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/sv/posts/${slug}`,
        lastmod: dateFallback,
      },
    ])

    return getServerSideSitemap(sitemap)
  } catch {
    return getServerSideSitemap([])
  }
}
