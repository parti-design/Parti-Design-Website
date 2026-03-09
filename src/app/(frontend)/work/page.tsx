import { WorkPage } from '@/components/WorkPage'
import { mediaUrl, queryAllProjects, serviceLabels } from '@/lib/payload-queries'

export default async function Page() {
  const projects = await queryAllProjects()

  const cards = projects.map((p) => ({
    title: p.title,
    slug: p.slug,
    tags: serviceLabels(p.services),
    description: p.tagline ?? '',
    imageSrc: mediaUrl(p.coverImage),
  }))

  return <WorkPage projects={cards} />
}

export const metadata = {
  title: 'Work — Parti Design',
  description:
    'Projects across architecture, digital design, co-building, and community facilitation.',
}
