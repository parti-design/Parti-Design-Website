import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Project } from '../../../payload-types'

const projectPaths = (slug?: string | null) =>
  slug
    ? [`/en/work/${slug}`, `/sv/work/${slug}`, `/work/${slug}`, '/en/work', '/sv/work', '/work']
    : ['/en/work', '/sv/work', '/work']

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      if (doc._status === 'published') {
        for (const path of projectPaths(doc.slug)) {
          payload.logger.info(`Revalidating project at path: ${path}`)
          revalidatePath(path)
        }
        revalidateTag('projects-sitemap')
      }

      if (previousDoc._status === 'published' && doc._status !== 'published') {
        for (const oldPath of projectPaths(previousDoc.slug)) {
          payload.logger.info(`Revalidating old project at path: ${oldPath}`)
          revalidatePath(oldPath)
        }
        revalidateTag('projects-sitemap')
      }
    } catch (_) {
      // revalidatePath requires a Next.js request context — safe to skip outside one (e.g. seed scripts)
    }
  }
  return doc
}

export const revalidateDeleteProject: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      for (const path of projectPaths(doc?.slug)) {
        revalidatePath(path)
      }
      revalidateTag('projects-sitemap')
    } catch (_) {
      // no-op outside Next.js request context
    }
  }
  return doc
}
