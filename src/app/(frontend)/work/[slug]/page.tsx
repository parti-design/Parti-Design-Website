import { ProjectDetailPage } from '@/components/ProjectDetailPage'
import { queryAdjacentProjects, queryProjectBySlug } from '@/lib/payload-queries'
import { notFound } from 'next/navigation'

export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const project = await queryProjectBySlug(slug)
  if (!project) notFound()

  const { prev, next } = await queryAdjacentProjects(slug)

  return <ProjectDetailPage project={project} prev={prev} next={next} />
}

export async function generateStaticParams() {
  // Returns empty on first deploy — pages are generated on demand via dynamicParams = true
  return []
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await queryProjectBySlug(slug)
  if (!project) return {}

  return {
    title: `${project.title} — Parti Design`,
    description: project.tagline ?? project.title,
  }
}
