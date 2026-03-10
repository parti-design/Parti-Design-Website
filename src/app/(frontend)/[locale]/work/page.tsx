/**
 * Work listing page — fetches all projects from Keystatic content files.
 */
import { WorkPage } from '@/components/WorkPage'
import { mediaUrl, queryAllProjects, serviceLabels } from '@/lib/keystatic-queries'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const projects = await queryAllProjects(locale)

  const cards = projects.map((p) => ({
    // Keystatic slug fields return an object with .value; handle both shapes
    title: typeof p?.title === 'object' && p?.title !== null
      ? ((p.title as unknown as { value?: string }).value ?? '')
      : (p?.title as unknown as string) ?? '',
    slug: p!.slug,
    tags: serviceLabels(p!.services, locale as 'en' | 'sv'),
    description: p!.tagline ?? '',
    imageSrc: mediaUrl(p!.coverImage),
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
