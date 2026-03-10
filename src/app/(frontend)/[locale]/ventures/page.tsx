import { VenturesPage } from '@/components/VenturesPage'
import { queryAllVentures } from '@/lib/payload-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const ventures = await queryAllVentures(locale)
  return <VenturesPage ventures={ventures} locale={locale as 'en' | 'sv'} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ventures' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
