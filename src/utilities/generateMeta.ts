/**
 * generateMeta — generates Next.js Metadata from a content document.
 * Updated to remove Payload Page/Post type dependency.
 */
import type { Metadata } from 'next'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

interface DocMeta {
  title?: string | null
  description?: string | null
  image?: { url?: string | null } | string | null
}

interface Doc {
  meta?: DocMeta | null
  slug?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
}

const getImageURL = (image?: { url?: string | null } | string | null) => {
  const serverUrl = getServerSideURL()
  const fallback = serverUrl + '/website-template-OG.webp'

  if (!image) return fallback
  if (typeof image === 'string') return image
  if ('url' in image && image.url) return serverUrl + image.url

  return fallback
}

export const generateMeta = async (args: {
  doc: Doc | null | undefined
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Parti Design'
    : doc?.metaTitle
    ? doc.metaTitle + ' | Parti Design'
    : 'Parti Design'

  return {
    description: doc?.meta?.description ?? doc?.metaDescription,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || doc?.metaDescription || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: doc?.slug ?? '/',
    }),
    title,
  }
}
