import { ContactPage } from '@/components/ContactPage'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default function Page() {
  return <ContactPage />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
