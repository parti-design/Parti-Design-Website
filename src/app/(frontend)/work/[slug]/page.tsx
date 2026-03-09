import { ProjectDetailPage } from '@/components/ProjectDetailPage'
import { getAdjacentProjects, getProject, PROJECTS } from '@/lib/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const { prev, next } = getAdjacentProjects(slug)

  return <ProjectDetailPage project={project} prev={prev} next={next} />
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  return {
    title: `${project.title} — Parti Design`,
    description: project.description,
  }
}
