/**
 * Ventures listing page — fetches all ventures from Keystatic content files.
 */
import { VenturesPage } from '@/components/VenturesPage'
import { queryAllVentures } from '@/lib/keystatic-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const ventures = await queryAllVentures(locale)
  // Pass as any — VenturesPage accepts the Keystatic shape (title, tagline, slug are present)
  return <VenturesPage ventures={ventures as any} locale={locale as 'en' | 'sv'} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ventures' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
