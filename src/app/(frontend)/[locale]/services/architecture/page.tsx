import { ServicePage } from '@/components/ServicePage'
import { mediaUrl, queryAllProjects, serviceLabels } from '@/lib/payload-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const allProjects = await queryAllProjects(locale)

  const projects = allProjects
    .filter((p) => p.services?.includes('architecture-spatial'))
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      tags: serviceLabels(p.services, locale as 'en' | 'sv'),
      description: p.tagline ?? '',
      imageSrc: mediaUrl(p.coverImage),
    }))

  return (
    <ServicePage
      locale={locale}
      namespace="architecturePage"
      heroImage="/assets/services/architecture-hero.jpg"
      projects={projects}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'architecturePage' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
