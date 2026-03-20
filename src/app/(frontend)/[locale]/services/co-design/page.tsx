import { ServicePage } from '@/components/ServicePage'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return <ServicePage locale={locale} namespace="coDesignPage" />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'coDesignPage' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
