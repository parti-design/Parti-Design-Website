import { StudioPage } from '@/components/StudioPage'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return <StudioPage locale={locale as 'en' | 'sv'} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'studio_page' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
