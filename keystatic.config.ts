/**
 * Keystatic CMS Configuration
 *
 * This file defines the content schema for the entire site.
 * Content is stored as MDX/YAML files in src/content/ and committed to git.
 *
 * Collections = repeatable content types (projects, ventures, posts)
 * Singletons  = single documents (header nav, footer nav)
 *
 * Localization strategy:
 *   English files ({slug}/en.mdx) contain ALL fields — shared + localized
 *   Swedish files ({slug}/sv.mdx) contain ONLY localized text fields
 *   At query time the two are merged; Swedish overrides English for text fields
 *
 * Admin UI: /keystatic
 * Auth: GitHub OAuth when KEYSTATIC_GITHUB_CLIENT_ID is set, otherwise open local mode
 */

import { config, collection, fields, singleton } from '@keystatic/core'

// ── Shared field definitions ──────────────────────────────────────────────────

/** The 7 service categories Parti Design offers. Used in Projects and Ventures. */
const serviceOptions = [
  { label: 'Architecture & Spatial Design', value: 'architecture-spatial' },
  { label: 'Graphic Design & Branding', value: 'graphic-design-branding' },
  { label: 'UX/UI & Digital', value: 'ux-ui-digital' },
  { label: 'Co-design Workshops', value: 'co-design-workshops' },
  { label: 'Facilitation & Project Management', value: 'facilitation-project-management' },
  { label: 'Placemaking Consulting', value: 'placemaking-consulting' },
  { label: 'Research & Development', value: 'research-development' },
] as const

// ── Storage config ────────────────────────────────────────────────────────────

/**
 * Storage mode is determined by whether GitHub credentials are configured,
 * NOT by NODE_ENV. This means:
 *
 *   Local dev (no env vars set) → 'local' mode
 *     Content is read/written directly from the filesystem.
 *     Admin UI at /keystatic works without any auth.
 *
 *   Production (Coolify has KEYSTATIC_GITHUB_CLIENT_ID set) → 'github' mode
 *     Content changes are committed to GitHub via the admin UI.
 *     Users must authenticate with their GitHub account to access /keystatic.
 *
 * Required env vars for GitHub mode (set in Coolify):
 *   KEYSTATIC_GITHUB_CLIENT_ID      — from your GitHub OAuth App
 *   KEYSTATIC_GITHUB_CLIENT_SECRET  — from your GitHub OAuth App
 *   KEYSTATIC_SECRET                — random string, e.g. `openssl rand -hex 32`
 *   KEYSTATIC_GITHUB_REPO_OWNER     — GitHub org or username
 *   KEYSTATIC_GITHUB_REPO_NAME      — repository name
 */
const storage = process.env.KEYSTATIC_GITHUB_CLIENT_ID
  ? ({
      kind: 'github' as const,
      repo: {
        owner: process.env.KEYSTATIC_GITHUB_REPO_OWNER ?? '',
        name: process.env.KEYSTATIC_GITHUB_REPO_NAME ?? '',
      },
    })
  : ({ kind: 'local' as const })

// ── Main config ───────────────────────────────────────────────────────────────

export default config({
  storage,

  ui: {
    brand: { name: 'Parti Design' },
    navigation: {
      // Group collections in the sidebar for clarity
      Content: ['projects', 'projectsSv', 'ventures', 'venturesSv', 'posts', 'postsSv'],
      Site: ['header', 'footer'],
    },
  },

  // ── Collections ─────────────────────────────────────────────────────────────

  collections: {

    // ── Projects (English) ───────────────────────────────────────────────────
    /**
     * Primary project collection. Stores all fields including shared ones
     * (coverImage, client, location, year, services, collaborators).
     * Path pattern: src/content/projects/{slug}/en.mdx
     */
    projects: collection({
      label: 'Projects (English)',
      slugField: 'title',
      path: 'src/content/projects/*/en',
      format: { contentField: 'content' },
      schema: {
        // Slug is auto-generated from title in the admin UI
        title: fields.slug({ name: { label: 'Title' } }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'Short one-line description shown on project cards.',
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          description: 'Main image shown in project listings and at the top of the detail page.',
          directory: 'public/media',
          publicPath: '/media',
        }),
        description: fields.mdx({
          label: 'Description',
          description: 'Brief project overview shown in the detail page introduction.',
        }),
        content: fields.mdx({
          label: 'Content',
          description: 'Full project content — the main body of the detail page.',
        }),
        // ── Project metadata ──
        client: fields.text({ label: 'Client' }),
        location: fields.text({ label: 'Location' }),
        year: fields.number({ label: 'Year' }),
        projectStatus: fields.select({
          label: 'Status',
          options: [
            { label: 'Completed', value: 'completed' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Study / Concept', value: 'study-concept' },
          ],
          defaultValue: 'completed',
        }),
        services: fields.multiselect({
          label: 'Services',
          description: 'Which Parti Design services were involved in this project.',
          options: serviceOptions,
        }),
        collaborators: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role', description: 'Optional role or title.' }),
          }),
          {
            label: 'Collaborators',
            itemLabel: (props) => props.fields.name.value || 'Collaborator',
          }
        ),
        // ── Display options ──
        featured: fields.checkbox({
          label: 'Featured',
          description: 'Featured projects appear on the home page.',
          defaultValue: false,
        }),
        relatedProjects: fields.array(
          fields.text({ label: 'Project slug' }),
          {
            label: 'Related Projects',
            description: 'Slugs of related projects to show at the bottom of the detail page.',
          }
        ),
        publishedAt: fields.date({ label: 'Published At' }),
        // ── SEO ──
        metaTitle: fields.text({ label: 'SEO Title', description: 'Defaults to project title if left blank.' }),
        metaDescription: fields.text({ label: 'SEO Description', multiline: true }),
      },
    }),

    // ── Projects (Swedish) ───────────────────────────────────────────────────
    /**
     * Swedish translations for projects. Only contains localized text fields.
     * Shared fields (images, client, year, etc.) are inherited from the English entry.
     * Path pattern: src/content/projects/{slug}/sv.mdx
     */
    projectsSv: collection({
      label: 'Projects (Swedish)',
      slugField: 'title',
      path: 'src/content/projects/*/sv',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        tagline: fields.text({ label: 'Tagline' }),
        description: fields.mdx({ label: 'Description' }),
        content: fields.mdx({ label: 'Content' }),
        metaTitle: fields.text({ label: 'SEO Title' }),
        metaDescription: fields.text({ label: 'SEO Description', multiline: true }),
      },
    }),

    // ── Ventures (English) ───────────────────────────────────────────────────
    /**
     * Ventures are projects incubated by Parti Design (Massvis, Umeå Kallbad, DIT Egnahem).
     * Unlike client projects, these are long-running initiatives the studio owns.
     * Path pattern: src/content/ventures/{slug}/en.mdx
     */
    ventures: collection({
      label: 'Ventures (English)',
      slugField: 'title',
      path: 'src/content/ventures/*/en',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'One-line description shown on venture cards.',
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/media',
          publicPath: '/media',
        }),
        description: fields.mdx({ label: 'Description' }),
        content: fields.mdx({ label: 'Content' }),
        externalUrl: fields.url({
          label: 'External URL',
          description: "Link to the venture's own website or platform.",
        }),
        ventureStatus: fields.select({
          label: 'Status',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'In Development', value: 'in-development' },
            { label: 'Completed', value: 'completed' },
          ],
          defaultValue: 'active',
        }),
        location: fields.text({ label: 'Location' }),
        services: fields.multiselect({
          label: 'Services',
          description: 'Which Parti Design services are involved.',
          options: serviceOptions,
        }),
        featured: fields.checkbox({
          label: 'Featured',
          description: 'Featured ventures appear on the home page.',
          defaultValue: false,
        }),
        order: fields.number({
          label: 'Display Order',
          description: 'Lower numbers appear first. Leave blank to sort alphabetically.',
        }),
        publishedAt: fields.date({ label: 'Published At' }),
        metaTitle: fields.text({ label: 'SEO Title' }),
        metaDescription: fields.text({ label: 'SEO Description', multiline: true }),
      },
    }),

    // ── Ventures (Swedish) ───────────────────────────────────────────────────
    venturesSv: collection({
      label: 'Ventures (Swedish)',
      slugField: 'title',
      path: 'src/content/ventures/*/sv',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        tagline: fields.text({ label: 'Tagline' }),
        description: fields.mdx({ label: 'Description' }),
        content: fields.mdx({ label: 'Content' }),
        metaTitle: fields.text({ label: 'SEO Title' }),
        metaDescription: fields.text({ label: 'SEO Description', multiline: true }),
      },
    }),

    // ── Posts (English) ──────────────────────────────────────────────────────
    /**
     * Blog posts / articles. Less structured than projects — mainly a title,
     * hero image, and free-form MDX content.
     * Path pattern: src/content/posts/{slug}/en.mdx
     */
    posts: collection({
      label: 'Posts (English)',
      slugField: 'title',
      path: 'src/content/posts/*/en',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/media',
          publicPath: '/media',
        }),
        content: fields.mdx({ label: 'Content' }),
        categories: fields.array(
          fields.text({ label: 'Category' }),
          { label: 'Categories' }
        ),
        authors: fields.array(
          fields.text({ label: 'Author name' }),
          { label: 'Authors', itemLabel: (props) => props.value || 'Author' }
        ),
        publishedAt: fields.date({ label: 'Published At' }),
        metaTitle: fields.text({ label: 'SEO Title' }),
        metaDescription: fields.text({ label: 'SEO Description', multiline: true }),
      },
    }),

    // ── Posts (Swedish) ──────────────────────────────────────────────────────
    postsSv: collection({
      label: 'Posts (Swedish)',
      slugField: 'title',
      path: 'src/content/posts/*/sv',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.mdx({ label: 'Content' }),
        metaTitle: fields.text({ label: 'SEO Title' }),
        metaDescription: fields.text({ label: 'SEO Description', multiline: true }),
      },
    }),
  },

  // ── Singletons ───────────────────────────────────────────────────────────────

  singletons: {
    /**
     * Global site header navigation.
     * Stored at: src/content/globals/header.yaml
     */
    header: singleton({
      label: 'Header',
      path: 'src/content/globals/header',
      schema: {
        navItems: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL path (e.g. /work)' }),
          }),
          {
            label: 'Navigation Items',
            itemLabel: (props) => props.fields.label.value || 'Nav Item',
          }
        ),
      },
    }),

    /**
     * Global site footer navigation.
     * Stored at: src/content/globals/footer.yaml
     */
    footer: singleton({
      label: 'Footer',
      path: 'src/content/globals/footer',
      schema: {
        navItems: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL path (e.g. /work)' }),
          }),
          {
            label: 'Navigation Items',
            itemLabel: (props) => props.fields.label.value || 'Nav Item',
          }
        ),
      },
    }),
  },
})
