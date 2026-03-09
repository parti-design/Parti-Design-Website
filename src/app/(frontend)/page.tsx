import { HomePage } from '@/components/HomePage'
import { mediaUrl, queryFeaturedProjects, queryFeaturedVentures, serviceLabels } from '@/lib/payload-queries'

export default async function Page() {
  const [rawProjects, ventures] = await Promise.all([
    queryFeaturedProjects(5),
    queryFeaturedVentures(3),
  ])

  const projects = rawProjects.map((p) => ({
    title: p.title,
    slug: p.slug,
    tags: serviceLabels(p.services),
    description: p.tagline ?? '',
    imageSrc: mediaUrl(p.coverImage),
  }))

  return <HomePage projects={projects} ventures={ventures} />
}

export const metadata = {
  title: 'Parti Design — Architecture, Design & Co-building',
  description:
    'A multidisciplinary architecture and design studio developing regenerative places through digital, physical and social systems. Based in Umeå, Sweden.',
}
