# Keystatic Migration Plan

## Overview

Migrate from Payload CMS v3 + PostgreSQL to Keystatic CMS with content stored as Markdown/JSON files in git. The Next.js 15 frontend stays — only the CMS layer and data fetching change.

**Why:** No database migrations ever again. Schema changes are TypeScript. Content lives in git. Non-technical editors get a visual admin UI at `/keystatic`.

---

## Scope Assessment

| Area | Complexity | Notes |
|------|-----------|-------|
| Keystatic schema (collections/globals) | Medium | Direct translation from Payload collection configs |
| Data fetching layer | Medium | Replace `payload-queries.ts` with file system reads |
| Rich text (Lexical → MDX) | High | Biggest technical challenge |
| Media handling | Medium | Static files stay; lose image size variants |
| Localization (EN/SV) | Medium | Keystatic has i18n support via path-based files |
| Forms | Medium | Replace FormBuilder plugin with external service |
| Redirects | Low | Move to `next.config.js` or middleware |
| Search | Low | Replace plugin with static index (e.g. Fuse.js) |
| Remove Payload entirely | Low | Delete config, migrations, collections, plugins |
| Re-enter content | Low-Medium | Depends how much content exists at migration time |

**Estimated effort:** 3–5 days of focused work on a separate branch.

---

## What Stays the Same

- Next.js 15 App Router — no framework change
- All React components in `src/components/` — mostly unchanged
- next-intl localization routing
- Tailwind CSS, Radix UI, all UI components
- Deployment on Coolify (no database service needed)
- Media files in `public/media/` — keep as-is

---

## What Changes

| Before (Payload) | After (Keystatic) |
|------------------|-------------------|
| `src/collections/` | `keystatic.config.ts` |
| `src/payload.config.ts` | Removed |
| `src/migrations/` | Removed |
| `src/lib/payload-queries.ts` | `src/lib/keystatic-queries.ts` (file system reads) |
| `src/app/(payload)/` | Removed |
| `src/app/(frontend)/next/seed/` | Removed |
| Rich text: Lexical JSON | MDX (Markdown with React components) |
| Media metadata in DB | YAML frontmatter in content files |
| Relationships via DB IDs | Slug references in frontmatter |
| Draft/versioning system | Git branches (or omit for simplicity) |
| Redirects plugin | `next.config.js` redirects array |
| Form builder plugin | Formspree |
| Search plugin | Fuse.js client-side search |

---

## Content Storage Structure

After migration, content lives in `src/content/` as files:

```
src/content/
├── projects/
│   ├── connect-tviste/
│   │   ├── en.mdx         ← English content (title, tagline, body)
│   │   └── sv.mdx         ← Swedish content
│   └── kotten-sauna/
│       ├── en.mdx
│       └── sv.mdx
├── ventures/
│   ├── massvis/
│   │   ├── en.mdx
│   │   └── sv.mdx
├── posts/
│   └── ...
├── pages/
│   └── ...
└── globals/
    ├── header.yaml
    └── footer.yaml
```

Each `.mdx` file has YAML frontmatter for structured fields and MDX body for rich text:

```mdx
---
title: Connect Tviste
tagline: Belonging through a connected neighbourhood
coverImage: /media/connect-tviste-cover.jpg
client: Kajeka / Campus X
location: Tvistevägen, Umeå, Sweden
year: 2024
services:
  - co-design-workshops
  - facilitation-project-management
collaborators:
  - name: Kasimir Suter Winter
  - name: Lisa Selin
  - name: Zoé Magnusson
projectStatus: completed
featured: false
publishedAt: "2024-03-01"
---

Project description and body content goes here as MDX...
```

---

## Migration Steps

### Phase 1 — Setup (Day 1)

1. **Work on branch:** `keystatic`

2. **Install Keystatic:**
   ```bash
   pnpm add @keystatic/core @keystatic/next
   ```

3. **Remove Payload packages:**
   ```bash
   pnpm remove payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/plugin-seo @payloadcms/plugin-redirects @payloadcms/plugin-nested-docs @payloadcms/plugin-form-builder @payloadcms/plugin-search @payloadcms/ui @payloadcms/admin-bar @payloadcms/live-preview-react
   ```

4. **Create `keystatic.config.ts`** — define all collections and globals (see Phase 2)

5. **Add Keystatic API route:**
   ```
   src/app/keystatic/layout.tsx
   src/app/keystatic/[[...params]]/page.tsx
   src/app/api/keystatic/[...params]/route.ts
   ```

6. **Update `next.config.js`** — remove `withPayload()` wrapper, add MDX support

---

### Phase 2 — Keystatic Schema (Day 1–2)

Write `keystatic.config.ts` with the following collections.

#### Collections to define:

**Projects** — fields:
- `title` (text, required) — localized
- `tagline` (text) — localized
- `coverImage` (image)
- `description` (mdx) — localized
- `content` (mdx) — localized
- `client`, `location`, `year` (text/number)
- `projectStatus` (select: completed | in-progress | study-concept)
- `services` (multiselect — 7 options)
- `collaborators` (array of `{ name, role }`)
- `featured` (checkbox)
- `relatedProjects` (array of slug references)
- `publishedAt` (date)
- `metaTitle`, `metaDescription` (SEO)

**Ventures** — same pattern plus `externalUrl`, `order`, `ventureStatus`

**Posts** — `title`, `heroImage`, `content` (mdx), `categories`, `authors`, `publishedAt`

**Pages** — `title`, `hero` (group), `layout` (blocks array)

**Categories** — `title`, `slug`

#### Globals:

**Header** — `navItems` (array of `{ label, href }`)

**Footer** — `navItems` (array of `{ label, href }`)

#### Localization approach — path-based files (Option A):

Separate MDX files per locale:
- `src/content/projects/connect-tviste/en.mdx`
- `src/content/projects/connect-tviste/sv.mdx`

English files contain all shared non-localized fields (coverImage, client, location, year, services, collaborators, etc.) plus the localized text fields. Swedish files contain only the localized text fields (title, tagline, description, content). At query time the two are merged, with Swedish overriding English for localized fields.

---

### Phase 3 — Data Fetching Layer (Day 2–3)

Replace `src/lib/payload-queries.ts` with `src/lib/keystatic-queries.ts` using Keystatic's `createReader()` API:

```ts
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

export async function queryAllProjects(locale: 'en' | 'sv') {
  const slugs = await reader.collections.projects.list()
  // fetch, merge locales, sort, return
}
```

Function names mirror `payload-queries.ts` so page components need minimal changes:
- `queryAllProjects(locale)`
- `queryProjectBySlug(slug, locale)`
- `queryAdjacentProjects(slug, locale)`
- `queryFeaturedProjects(limit, locale)`
- `queryAllVentures(locale)`
- `queryFeaturedVentures(limit, locale)`
- `queryVentureBySlug(slug, locale)`
- `queryAllPosts(locale)`
- `queryPostBySlug(slug, locale)`
- `queryHeader()` / `queryFooter()`

---

### Phase 4 — Rich Text (Day 3)

**This is the hardest part.**

Payload used Lexical (JSON-based). Keystatic uses its own document format rendered via `@keystatic/core/renderer`. Replace `<RichText data={...} />` with `<DocumentRenderer document={...} />`.

Create `src/components/MDXContent/index.tsx` wrapping `DocumentRenderer` with custom renderers for headings, lists, images, code blocks, links.

For existing content: most project content was lost in the Postgres migration anyway, so content will be re-entered fresh into the new MDX files — no conversion needed.

---

### Phase 5 — Media (Day 3–4)

**Files stay put** — `public/media/` is unchanged.

**What changes:**
- Media is referenced by path string in frontmatter (e.g. `/media/filename.jpg`)
- No DB-backed image size variants — use Next.js `<Image>` directly with `width`/`height` props
- Update the `<Media>` component to accept plain path strings

---

### Phase 6 — Remove Payload (Day 4)

Delete:
- `src/payload.config.ts`
- `src/collections/`
- `src/migrations/`
- `src/plugins/`
- `src/app/(payload)/`
- `src/app/(frontend)/next/seed/`
- `src/app/(frontend)/next/preview/`
- `src/app/(frontend)/next/exit-preview/`

Remove `withPayload()` from `next.config.js`. Remove `AdminBar` and `LivePreviewListener` from layouts.

---

### Phase 7 — Replace Plugins (Day 4–5)

**SEO plugin → frontmatter fields:**
- Add `metaTitle`, `metaDescription` fields to each collection
- Populate via `generateMetadata()` in Next.js page files

**Redirects plugin → `next.config.js`:**
```js
redirects: async () => [
  { source: '/old-path', destination: '/new-path', permanent: true },
]
```

**Form builder plugin → Formspree:**
- Replace `<FormBlock>` with a simple form posting to Formspree endpoint
- Keep existing `ContactForm.tsx`, point at Formspree

**Search plugin → Fuse.js:**
- Generate a static search index from content files at build time
- Client-side fuzzy search — no server required

---

### Phase 8 — Testing & Deploy (Day 5)

1. `pnpm dev` — fix TypeScript / import errors
2. Test all pages in EN and SV
3. Test Keystatic admin at `/keystatic` — create a test project, edit a venture
4. Test media uploads (files land in `public/media/`)
5. `pnpm build` — verify clean build
6. Push branch, deploy on Coolify for staging review

**Environment variables after migration:**
- Remove: `DATABASE_URL`, `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`
- Keep: `NEXT_PUBLIC_SERVER_URL`, `UPLOAD_DIR`
- Add: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`

**Coolify changes:**
- Remove the PostgreSQL service
- Remove `payload migrate &&` from startup command (just `next start`)
- Hetzner volume mount for `public/media/` stays the same

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| MDX rendering complexity vs Lexical | Scope to simple formatting + a few custom components |
| Keystatic i18n support maturity | Test early; fallback: two separate collection configs per locale |
| Non-technical editors learning MDX | Keystatic's editor is visual — editors never see raw MDX |
| Large media files in git | Keep `public/media/` in `.gitignore`; files stay on Hetzner volume |
| Loss of draft/versioning | Low priority; use git branches for drafts if needed |

---

## Keystatic Admin Auth

**GitHub OAuth (production):**
- Users log in with their GitHub account
- Only repo members can access `/keystatic`
- Requires `KEYSTATIC_GITHUB_CLIENT_ID` + `KEYSTATIC_GITHUB_CLIENT_SECRET`
- Karina and any collaborators need a GitHub account

**Local mode (development):**
- No auth — admin open to anyone on localhost
- Set `storage: { kind: 'local' }` in `keystatic.config.ts` for dev

---

## Content Entry After Migration

Since most project content was lost in the Postgres migration, content will be re-entered regardless. With Keystatic this is done through the visual admin UI or directly in the MDX files.

Priority order:
1. Projects (portfolio is the critical gap)
2. Ventures (taglines already set; add descriptions)
3. Header/Footer nav
4. Pages (Home, About, Contact)
5. Posts (lower priority)

---

## Decision Checklist

- [x] Keep Posts/blog — yes
- [x] Auth — GitHub OAuth
- [x] Contact form — Formspree
- [x] Media — keep `public/media/`, no git LFS needed
- [ ] Confirm GitHub repo owner/name for `keystatic.config.ts` storage config
- [ ] Set up GitHub OAuth app (Settings → Developer settings → OAuth Apps)
- [ ] Set up Formspree form and get endpoint URL
