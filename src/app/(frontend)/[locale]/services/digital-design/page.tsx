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
    .filter(
      (p) =>
        p.services?.includes('ux-ui-digital') ||
        p.services?.includes('graphic-design-branding'),
    )
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
      namespace="digitalDesignPage"
      heroImage="/assets/services/Artists-Website.jpg"
      projects={projects}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'digitalDesignPage' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
