import { VentureDetailPage } from '@/components/VentureDetailPage'
import { queryVentureBySlug } from '@/lib/payload-queries'
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

  return {
    title: `${venture.title} — Parti Design`,
    description: venture.tagline ?? venture.title,
  }
}
