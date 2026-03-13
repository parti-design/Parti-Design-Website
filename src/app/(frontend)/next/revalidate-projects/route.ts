import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

const workIndexPaths = ['/work', '/en/work', '/sv/work']

const projectPaths = (slug: string) => [`/work/${slug}`, `/en/work/${slug}`, `/sv/work/${slug}`]

const unauthorizedResponse = () =>
  Response.json({ error: 'Unauthorized' }, { status: 401 })

const uniqueSlugs = (slugs: Array<string | null | undefined>) =>
  [...new Set(slugs.map((slug) => slug?.trim()).filter((slug): slug is string => Boolean(slug)))]

async function resolveRequestedSlugs(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const querySlugs = searchParams.getAll('slug')

  if (querySlugs.length > 0) {
    return uniqueSlugs(querySlugs)
  }

  if (req.method === 'POST') {
    try {
      const body = (await req.json()) as { slugs?: string[] } | null
      if (body?.slugs?.length) {
        return uniqueSlugs(body.slugs)
      }
    } catch {
      // Empty or invalid JSON should fall back to all published projects.
    }
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return uniqueSlugs(result.docs.map((project) => project.slug))
}

async function handle(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return Response.json({ error: 'CRON_SECRET is not configured' }, { status: 500 })
  }

  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return unauthorizedResponse()
  }

  const slugs = await resolveRequestedSlugs(req)
  const paths = uniqueSlugs([...workIndexPaths, ...slugs.flatMap(projectPaths)])

  for (const path of paths) {
    revalidatePath(path)
  }
  revalidateTag('projects-sitemap')

  return Response.json({
    revalidated: true,
    slugCount: slugs.length,
    pathCount: paths.length,
    slugs,
    paths,
  })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
