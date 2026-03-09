import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Media, Project, Venture } from '@/payload-types'

// ─── Service label map ────────────────────────────────────────────────────────

export const SERVICE_LABELS: Record<string, string> = {
  'architecture-spatial': 'Architecture',
  'graphic-design-branding': 'Branding',
  'ux-ui-digital': 'Digital',
  'co-design-workshops': 'Co-building',
  'facilitation-project-management': 'Facilitation',
  'placemaking-consulting': 'Placemaking',
  'research-development': 'R&D',
}

export function serviceLabels(services?: Project['services']): string[] {
  if (!services) return []
  return services.map((s) => SERVICE_LABELS[s] ?? s)
}

/** Extract a URL string from a Payload upload field (which may be a number ID or a Media object) */
export function mediaUrl(field: number | Media | null | undefined): string | undefined {
  if (!field || typeof field !== 'object') return undefined
  return field.url ?? undefined
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const queryAllProjects = cache(async (): Promise<Project[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
})

export const queryProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      draft: false,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      depth: 2,
      where: { slug: { equals: slug } },
    })
    return result.docs?.[0] ?? null
  } catch {
    return null
  }
})

export async function queryAdjacentProjects(slug: string) {
  const all = await queryAllProjects()
  const idx = all.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? (all[idx - 1] ?? null) : null,
    next: idx < all.length - 1 ? (all[idx + 1] ?? null) : null,
  }
}

export const queryFeaturedProjects = cache(async (limit = 5): Promise<Project[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const featured = await payload.find({
      collection: 'projects',
      draft: false,
      limit,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      where: { featured: { equals: true } },
    })
    if (featured.docs.length > 0) return featured.docs
    // Fall back to most recent projects
    const all = await queryAllProjects()
    return all.slice(0, limit)
  } catch {
    return []
  }
})

// ─── Ventures ─────────────────────────────────────────────────────────────────

export const queryAllVentures = cache(async (): Promise<Venture[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'ventures',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      sort: 'order',
    })
    return result.docs
  } catch {
    return []
  }
})

export const queryFeaturedVentures = cache(async (limit = 3): Promise<Venture[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const featured = await payload.find({
      collection: 'ventures',
      draft: false,
      limit,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      sort: 'order',
      where: { featured: { equals: true } },
    })
    if (featured.docs.length > 0) return featured.docs
    const all = await queryAllVentures()
    return all.slice(0, limit)
  } catch {
    return []
  }
})
