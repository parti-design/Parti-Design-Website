/**
 * Project detail page — fetches a single project from Keystatic content files.
 * The slug comes from the directory name in src/content/projects/{slug}/en.mdx
 */
import { ProjectDetailPage } from '@/components/ProjectDetailPage'
import { queryAdjacentProjects, queryProjectBySlug } from '@/lib/keystatic-queries'
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

  // Pass the project as-is; ProjectDetailPage is updated to accept the Keystatic shape
  return <ProjectDetailPage project={project as any} prev={prev as any} next={next as any} locale={locale as 'en' | 'sv'} />
}

export async function generateStaticParams() {
  // Returns empty on first deploy — pages are generated on demand via dynamicParams = true
  return []
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const project = await queryProjectBySlug(slug, locale)
  if (!project) return {}

  // Keystatic slug fields return { value: string }; handle both shapes
  const title = typeof project.title === 'object' && project.title !== null
    ? ((project.title as unknown as { value?: string }).value ?? slug)
    : (project.title as unknown as string) ?? slug

  return {
    title: `${title} — Parti Design`,
    description: project.tagline ?? title,
  }
}
