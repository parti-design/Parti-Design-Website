/**
 * Data fetching layer for Keystatic content.
 *
 * Uses Keystatic's `createReader()` to read content files from the filesystem
 * at build time and in server components. No database or network requests needed.
 *
 * Localization strategy:
 *   - English content is the source of truth for all shared fields
 *   - Swedish content files only contain localized text fields
 *   - `mergeLocale()` merges them, with Swedish overriding English text fields
 *
 * Function names mirror the old payload-queries.ts so page components
 * need minimal changes.
 */

import { createReader } from '@keystatic/core/reader'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import keystaticConfig from '../../keystatic.config'

// Single reader instance — Keystatic caches file reads internally
const reader = createReader(process.cwd(), keystaticConfig)

/**
 * Keystatic's reader.collections.X.list() only works when collection files are
 * flat (e.g. connect-tviste.mdx) or use an index (connect-tviste/index.mdx).
 * Our structure is connect-tviste/en.mdx — so we list directories manually
 * and rely on reader.collections.X.read(slug) which correctly resolves the path.
 */
async function listContentSlugs(type: 'projects' | 'ventures' | 'posts'): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), 'src/content', type)
    const entries = await readdir(dir, { withFileTypes: true })
    return entries.filter(e => e.isDirectory()).map(e => e.name)
  } catch {
    return []
  }
}

export type Locale = 'en' | 'sv'

type PublishableProject = {
  draft?: boolean | null
}

function isPublishedProject<T extends PublishableProject | null | undefined>(project: T): project is Exclude<T, null | undefined> {
  return Boolean(project) && !project?.draft
}

// ── Service label helpers ─────────────────────────────────────────────────────

/** Maps service value keys to human-readable labels in each locale */
export const SERVICE_LABELS: Record<string, Record<Locale, string>> = {
  'architecture-spatial':           { en: 'Architecture & Spatial Design',    sv: 'Arkitektur & Rumslig design' },
  'graphic-design-branding':        { en: 'Graphic Design & Branding',        sv: 'Grafisk design & varumärke' },
  'ux-ui-digital':                  { en: 'UX/UI & Digital',                  sv: 'UX/UI & Digital' },
  'co-design-workshops':            { en: 'Co-design Workshops',              sv: 'Co-design workshops' },
  'facilitation-project-management':{ en: 'Facilitation & Project Management',sv: 'Facilitering & projektledning' },
  'placemaking-consulting':         { en: 'Placemaking Consulting',           sv: 'Placemaking-konsulting' },
  'research-development':           { en: 'Research & Development',           sv: 'Forskning & utveckling' },
}

/** Returns human-readable service labels for a given locale */
export function serviceLabels(services: readonly string[] | string[] | null | undefined, locale: Locale): string[] {
  if (!services) return []
  return services.map((s) => SERVICE_LABELS[s]?.[locale] ?? s)
}

/**
 * Helper to extract a URL string from either:
 *  - a plain string (Keystatic stores image paths as strings)
 *  - an old Payload media object with a `url` field
 * Returns undefined if the value is null/empty.
 */
export function mediaUrl(
  field: string | { url?: string | null } | null | undefined,
): string | undefined {
  if (!field) return undefined
  if (typeof field === 'string') return field || undefined
  return field.url ?? undefined
}

// ── Projects ──────────────────────────────────────────────────────────────────

/**
 * Fetches all published projects sorted by publishedAt descending.
 * For Swedish locale, merges sv.mdx fields over the en.mdx base.
 */
export async function queryAllProjects(locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  try {
    const slugs = await listContentSlugs('projects')

    const projects = await Promise.all(
      slugs.map((slug) => queryProjectBySlug(slug, normalizedLocale))
    )

    return projects
      .filter(isPublishedProject)
      .sort((a, b) => (b?.publishedAt ?? '').localeCompare(a?.publishedAt ?? ''))
  } catch {
    return []
  }
}

/**
 * Fetches a single project by slug. Returns null if not found.
 * Swedish locale merges sv.mdx fields over the en.mdx document.
 */
export async function queryProjectBySlug(slug: string, locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  try {
    const enDoc = await reader.collections.projects.read(slug)
    if (!enDoc) return null
    if (enDoc.draft) return null

    if (normalizedLocale === 'sv') {
      const svDoc = await reader.collections.projectsSv.read(slug)
      // Merge: en provides the base (all fields), sv overrides localized text
      return { ...enDoc, ...(svDoc ?? {}), slug, locale: normalizedLocale }
    }

    return { ...enDoc, slug, locale: normalizedLocale }
  } catch {
    return null
  }
}

/**
 * Returns up to `limit` featured projects.
 * Falls back to the most recent projects if none are marked featured.
 */
export async function queryFeaturedProjects(limit = 5, locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale
  const all = await queryAllProjects(normalizedLocale)
  const featured = all.filter((p) => p?.featured)
  return (featured.length > 0 ? featured : all).slice(0, limit)
}

/**
 * Returns the project immediately before and after the given slug
 * (by publishedAt order), used for prev/next navigation on detail pages.
 */
export async function queryAdjacentProjects(slug: string, locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale
  const all = await queryAllProjects(normalizedLocale)
  const idx = all.findIndex((p) => p?.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}

// ── Ventures ──────────────────────────────────────────────────────────────────

/**
 * Fetches all ventures sorted by their `order` field (ascending).
 * Ventures without an order value sort last.
 */
export async function queryAllVentures(locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  try {
    const slugs = await listContentSlugs('ventures')

    const ventures = await Promise.all(
      slugs.map((slug) => queryVentureBySlug(slug, normalizedLocale))
    )

    return ventures
      .filter(Boolean)
      .sort((a, b) => (a?.order ?? 99) - (b?.order ?? 99))
  } catch {
    return []
  }
}

/** Fetches a single venture by slug. Returns null if not found. */
export async function queryVentureBySlug(slug: string, locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  try {
    const enDoc = await reader.collections.ventures.read(slug)
    if (!enDoc) return null

    if (normalizedLocale === 'sv') {
      const svDoc = await reader.collections.venturesSv.read(slug)
      return { ...enDoc, ...(svDoc ?? {}), slug, locale: normalizedLocale }
    }

    return { ...enDoc, slug, locale: normalizedLocale }
  } catch {
    return null
  }
}

/**
 * Returns up to `limit` featured ventures.
 * Falls back to all ventures if none are marked featured.
 */
export async function queryFeaturedVentures(limit = 3, locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale
  const all = await queryAllVentures(normalizedLocale)
  const featured = all.filter((v) => v?.featured)
  return (featured.length > 0 ? featured : all).slice(0, limit)
}

// ── Posts ─────────────────────────────────────────────────────────────────────

/**
 * Fetches all posts sorted by publishedAt descending.
 */
export async function queryAllPosts(locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  try {
    const slugs = await listContentSlugs('posts')

    const posts = await Promise.all(
      slugs.map((slug) => queryPostBySlug(slug, normalizedLocale))
    )

    return posts
      .filter(Boolean)
      .sort((a, b) => (b?.publishedAt ?? '').localeCompare(a?.publishedAt ?? ''))
  } catch {
    return []
  }
}

/** Fetches a single post by slug. Returns null if not found. */
export async function queryPostBySlug(slug: string, locale: Locale | string = 'en') {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  try {
    const enDoc = await reader.collections.posts.read(slug)
    if (!enDoc) return null

    if (normalizedLocale === 'sv') {
      const svDoc = await reader.collections.postsSv.read(slug)
      return { ...enDoc, ...(svDoc ?? {}), slug, locale: normalizedLocale }
    }

    return { ...enDoc, slug, locale: normalizedLocale }
  } catch {
    return null
  }
}

// ── Homepage content ──────────────────────────────────────────────────────────

/**
 * All editable text on the homepage.
 * English is the source of truth; Swedish overrides text fields.
 */
export interface HomepageContent {
  heroHeadline: string
  heroSubstatement: string
  heroCta: string
  heroCtaContact: string
  marqueeTerms: readonly string[]
  workSectionHeading: string
  digitalLabel: string
  digitalHeading: string
  digitalBody: string
  digitalExamples: string
  physicalLabel: string
  physicalHeading: string
  physicalBody: string
  physicalExamples: string
  socialLabel: string
  socialHeading: string
  socialBody: string
  socialExamples: string
  studioHeading: string
  studioBody1: string
  studioQuote: string
  studioBody2: string
  studioPhotoAlt: string
  venturesTeaser: string
  venturesBody: string
  byggemenskapHeading: string
  byggemenskapBody: string
  byggemenskapCta: string
  closingHeading: string
  closingBody: string
  closingCta: string
  contactEmail: string
}

/**
 * Fetches homepage content for the given locale.
 * Swedish content merges over English — any blank Swedish field falls back to English.
 */
export async function queryHomepageContent(locale: Locale | string = 'en'): Promise<HomepageContent> {
  const normalizedLocale = (locale === 'sv' ? 'sv' : 'en') as Locale

  const enDoc = await reader.singletons.homepageEn.read()
  const base = (enDoc ?? {}) as Partial<HomepageContent>

  if (normalizedLocale === 'sv') {
    const svDoc = await reader.singletons.homepageSv.read()
    const sv = (svDoc ?? {}) as Partial<HomepageContent>
    // Merge: Swedish overrides English, but empty strings fall back to English
    const merged: Partial<HomepageContent> = { ...base }
    for (const key of Object.keys(sv) as (keyof HomepageContent)[]) {
      const val = sv[key]
      if (typeof val === 'string' ? val.length > 0 : Array.isArray(val) && val.length > 0) {
        merged[key] = val
      }
    }
    return merged as HomepageContent
  }

  return base as HomepageContent
}

// ── Globals ───────────────────────────────────────────────────────────────────

/**
 * Fetches the global header navigation items.
 * Stored at src/content/globals/header.yaml
 */
export async function queryHeader() {
  try {
    return reader.singletons.header.read()
  } catch {
    return null
  }
}

/**
 * Fetches the global footer navigation items.
 * Stored at src/content/globals/footer.yaml
 */
export async function queryFooter() {
  try {
    return reader.singletons.footer.read()
  } catch {
    return null
  }
}
