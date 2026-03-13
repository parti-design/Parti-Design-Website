import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Media, Project, Venture } from '@/payload-types'

// ─── Service label map ────────────────────────────────────────────────────────

const SERVICE_LABELS: Record<'en' | 'sv', Record<string, string>> = {
  en: {
    'architecture-spatial': 'Architecture',
    'graphic-design-branding': 'Branding',
    'ux-ui-digital': 'Digital',
    'co-design-workshops': 'Co-building',
    'facilitation-project-management': 'Facilitation',
    'placemaking-consulting': 'Placemaking',
    'research-development': 'R&D',
  },
  sv: {
    'architecture-spatial': 'Arkitektur',
    'graphic-design-branding': 'Varumärke',
    'ux-ui-digital': 'Digitalt',
    'co-design-workshops': 'Sambygge',
    'facilitation-project-management': 'Facilitering',
    'placemaking-consulting': 'Platsskapande',
    'research-development': 'FoU',
  },
}

export function serviceLabels(services?: Project['services'], locale: 'en' | 'sv' = 'en'): string[] {
  if (!services) return []
  return services.map((s) => SERVICE_LABELS[locale][s] ?? s)
}

/** Extract a URL string from a Payload upload field (which may be a number ID or a Media object).
 *  Pass a `size` name (e.g. 'large', 'xlarge') to use a resized variant instead of the original. */
export function mediaUrl(
  field: number | Media | null | undefined,
  size?: string,
): string | undefined {
  if (!field || typeof field !== 'object') return undefined
  if (size) {
    const sized = (field.sizes as Record<string, { url?: string | null } | undefined> | undefined)?.[size]
    if (sized?.url) return sized.url
  }
  return field.url ?? undefined
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const queryAllProjects = cache(async (locale = 'en'): Promise<Project[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      locale: locale as 'en' | 'sv',
    })
    return result.docs
  } catch {
    return []
  }
})

export const queryProjectBySlug = cache(async (slug: string, locale = 'en'): Promise<Project | null> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      draft: false,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      depth: 2,
      locale: locale as 'en' | 'sv',
      where: { slug: { equals: slug } },
    })
    return result.docs?.[0] ?? null
  } catch {
    return null
  }
})

export async function queryAdjacentProjects(slug: string, locale = 'en') {
  const all = await queryAllProjects(locale)
  const idx = all.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? (all[idx - 1] ?? null) : null,
    next: idx < all.length - 1 ? (all[idx + 1] ?? null) : null,
  }
}

export const queryFeaturedProjects = cache(async (limit = 5, locale = 'en'): Promise<Project[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const featured = await payload.find({
      collection: 'projects',
      draft: false,
      limit,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      locale: locale as 'en' | 'sv',
      where: { featured: { equals: true } },
    })
    if (featured.docs.length > 0) return featured.docs
    // Fall back to most recent projects
    const all = await queryAllProjects(locale)
    return all.slice(0, limit)
  } catch {
    return []
  }
})

// ─── Ventures ─────────────────────────────────────────────────────────────────

export const queryAllVentures = cache(async (locale = 'en'): Promise<Venture[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'ventures',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      locale: locale as 'en' | 'sv',
      sort: 'order',
    })
    return result.docs
  } catch {
    return []
  }
})

export const queryFeaturedVentures = cache(async (limit = 3, locale = 'en'): Promise<Venture[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const featured = await payload.find({
      collection: 'ventures',
      draft: false,
      limit,
      overrideAccess: false,
      pagination: false,
      depth: 1,
      locale: locale as 'en' | 'sv',
      sort: 'order',
      where: { featured: { equals: true } },
    })
    if (featured.docs.length > 0) return featured.docs
    const all = await queryAllVentures(locale)
    return all.slice(0, limit)
  } catch {
    return []
  }
})

export const queryVentureBySlug = cache(async (slug: string, locale = 'en'): Promise<Venture | null> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'ventures',
      draft: false,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      depth: 2,
      locale: locale as 'en' | 'sv',
      where: { slug: { equals: slug } },
    })
    return result.docs?.[0] ?? null
  } catch {
    return null
  }
})
