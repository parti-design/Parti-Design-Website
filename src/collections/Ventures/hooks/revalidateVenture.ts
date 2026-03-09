import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Venture } from '../../../payload-types'

export const revalidateVenture: CollectionAfterChangeHook<Venture> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      if (doc._status === 'published') {
        const path = `/ventures/${doc.slug}`

        payload.logger.info(`Revalidating venture at path: ${path}`)

        revalidatePath(path)
        revalidateTag('ventures-sitemap')
      }

      if (previousDoc._status === 'published' && doc._status !== 'published') {
        const oldPath = `/ventures/${previousDoc.slug}`

        payload.logger.info(`Revalidating old venture at path: ${oldPath}`)

        revalidatePath(oldPath)
        revalidateTag('ventures-sitemap')
      }
    } catch (_) {
      // revalidatePath requires a Next.js request context — safe to skip outside one (e.g. seed scripts)
    }
  }
  return doc
}

export const revalidateDeleteVenture: CollectionAfterDeleteHook<Venture> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      const path = `/ventures/${doc?.slug}`
      revalidatePath(path)
      revalidateTag('ventures-sitemap')
    } catch (_) {
      // no-op outside Next.js request context
    }
  }
  return doc
}
