import { HomePage } from '@/components/HomePage'
import { mediaUrl, queryFeaturedProjects, queryFeaturedVentures, serviceLabels } from '@/lib/payload-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  const [rawProjects, ventures] = await Promise.all([
    queryFeaturedProjects(5, locale),
    queryFeaturedVentures(3, locale),
  ])

  const projects = rawProjects.map((p) => ({
    title: p.title,
    slug: p.slug,
    tags: serviceLabels(p.services, locale as 'en' | 'sv'),
    description: p.tagline ?? '',
    imageSrc: mediaUrl(p.coverImage),
  }))

  return <HomePage projects={projects} ventures={ventures} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: t('title'),
    description: t('description'),
  }
}
