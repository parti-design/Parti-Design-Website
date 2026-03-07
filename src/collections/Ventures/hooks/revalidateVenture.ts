import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Venture } from '../../../payload-types'

export const revalidateVenture: CollectionAfterChangeHook<Venture> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
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
  }
  return doc
}

export const revalidateDeleteVenture: CollectionAfterDeleteHook<Venture> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/ventures/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('ventures-sitemap')
  }
  return doc
}
