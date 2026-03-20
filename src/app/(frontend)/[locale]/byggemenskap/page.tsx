import { ByggememskapPage } from '@/components/ByggememskapPage'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return <ByggememskapPage locale={locale} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'byggemenskapPage' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
