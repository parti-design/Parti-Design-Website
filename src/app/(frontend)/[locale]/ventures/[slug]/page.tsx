import { VentureDetailPage } from '@/components/VentureDetailPage'
import { mediaUrl } from '@/lib/payload-queries'
import { queryVentureBySlug } from '@/lib/payload-queries'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { notFound } from 'next/navigation'

export const dynamicParams = true

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  const venture = await queryVentureBySlug(slug, locale)

  if (!venture) notFound()

  return <VentureDetailPage venture={venture} locale={locale as 'en' | 'sv'} />
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const venture = await queryVentureBySlug(slug, locale)

  if (!venture) return {}

  const title = venture.meta?.title || `${venture.title} — Parti Design`
  const description = venture.meta?.description || venture.tagline || venture.title
  const imagePath =
    mediaUrl(venture.meta?.image, 'og') ||
    mediaUrl(venture.meta?.image) ||
    mediaUrl(venture.coverImage, 'og') ||
    mediaUrl(venture.coverImage)
  const imageURL = imagePath ? `${getServerSideURL()}${imagePath}` : undefined

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url: `/${locale}/ventures/${venture.slug}`,
      images: imageURL
        ? [
            {
              url: imageURL,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageURL ? [imageURL] : undefined,
    },
  }
}
