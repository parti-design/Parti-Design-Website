import { WorkPage } from '@/components/WorkPage'
import { mediaUrl, queryAllProjects, serviceLabels } from '@/lib/payload-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const projects = await queryAllProjects(locale)

  const cards = projects.map((p) => ({
    title: p.title,
    slug: p.slug,
    tags: serviceLabels(p.services, locale as 'en' | 'sv'),
    description: p.tagline ?? '',
    imageSrc: mediaUrl(p.coverImage),
  }))

  return <WorkPage projects={cards} locale={locale as 'en' | 'sv'} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work' })
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}
