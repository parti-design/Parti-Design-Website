/**
 * Home page — fetches featured projects and ventures from Keystatic content files.
 */
import { HomePage } from '@/components/HomePage'
import { mediaUrl, queryFeaturedProjects, queryFeaturedVentures, queryHomepageContent, serviceLabels } from '@/lib/keystatic-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  const [rawProjects, ventures, homepageContent] = await Promise.all([
    queryFeaturedProjects(5, locale),
    queryFeaturedVentures(3, locale),
    queryHomepageContent(locale),
  ])

  const projects = rawProjects.map((p) => ({
    // Keystatic slug fields return { value: string }; handle both shapes
    title: typeof p!.title === 'object' && p!.title !== null
      ? ((p!.title as unknown as { value?: string }).value ?? p!.slug)
      : (p!.title as unknown as string) ?? p!.slug,
    slug: p!.slug,
    tags: serviceLabels(p!.services, locale as 'en' | 'sv'),
    description: p!.tagline ?? '',
    imageSrc: mediaUrl(p!.coverImage),
  }))

  // Ventures need title resolved (Keystatic slug field returns an object with .value)
  const ventureCards = ventures.map((v) => ({
    ...v!,
    title: (v!.title as unknown as { value?: string } | string)
      ? typeof v!.title === 'object' && v!.title !== null
        ? ((v!.title as unknown as { value?: string }).value ?? '')
        : (v!.title as unknown as string)
      : '',
    tagline: v!.tagline ?? '',
  }))

  return <HomePage projects={projects} ventures={ventureCards} content={homepageContent} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: t('title'),
    description: t('description'),
  }
}
