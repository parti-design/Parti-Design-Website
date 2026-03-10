import { ProjectDetailPage } from '@/components/ProjectDetailPage'
import { queryAdjacentProjects, queryProjectBySlug } from '@/lib/payload-queries'
import { notFound } from 'next/navigation'

export const dynamicParams = true

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  const project = await queryProjectBySlug(slug, locale)
  if (!project) notFound()

  const { prev, next } = await queryAdjacentProjects(slug, locale)

  return <ProjectDetailPage project={project} prev={prev} next={next} locale={locale as 'en' | 'sv'} />
}

export async function generateStaticParams() {
  // Returns empty on first deploy — pages are generated on demand via dynamicParams = true
  return []
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const project = await queryProjectBySlug(slug, locale)
  if (!project) return {}

  return {
    title: `${project.title} — Parti Design`,
    description: project.tagline ?? project.title,
  }
}
