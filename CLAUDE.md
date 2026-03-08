# CLAUDE.md — Parti Design Website

Project reference for AI-assisted development. Read this at the start of every session.

---

## Commands

```bash
pnpm dev          # Start dev server (Next.js + Payload CMS)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm test         # Run all tests (integration + e2e)
pnpm test:int     # Vitest integration tests
pnpm test:e2e     # Playwright e2e tests
pnpm payload generate:types   # Regenerate payload-types.ts after schema changes
```

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| CMS | Payload CMS 3 (Postgres) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Components | Radix UI primitives + shadcn/ui pattern |
| Variant styling | class-variance-authority (CVA) |
| Class merging | `cn()` from `@/utilities/ui` |
| Fonts | Expletus Sans (display), Mulish (body), Geist Mono |
| Icons | lucide-react |
| Forms | react-hook-form |
| Testing | Vitest (unit) + Playwright (e2e) |

---

## File Structure

```
src/
  app/
    (frontend)/         # Public-facing Next.js routes
      globals.css       # Design system: tokens, utilities, dark mode
      layout.tsx        # Root layout (fonts, providers, header, footer)
      page.tsx          # Home page
    (payload)/          # Payload CMS admin routes (do not edit manually)
  collections/          # Payload CMS data collections
    Pages/
    Posts/
    Projects/           # Portfolio work (linked to services)
    Ventures/           # Initiatives & ventures
    Categories.ts
    Media.ts
    Users/
  components/
    HomePage/           # Home page sections
    ui/                 # shadcn/ui base components (button, card, input, etc.)
    AdminBar/
    Card/
    CollectionArchive/
    Link/               # CMS-aware link wrapper
    Logo/
    Media/              # Image + video handlers
    Pagination/
    RichText/           # Lexical rich text renderer
  blocks/               # Payload page builder blocks
    Banner/
    CallToAction/
    Content/
    Code/
    Form/
    MediaBlock/
    ArchiveBlock/
    RenderBlocks.tsx    # Block renderer switch
  heros/                # Hero variants (High/Medium/Low/Post impact)
  Header/               # Global header (server wrapper + client component)
  Footer/               # Global footer
  fields/               # Reusable Payload field configs
  providers/            # React context providers (Theme, HeaderTheme)
  utilities/            # Shared helper functions
  payload.config.ts     # Main Payload CMS configuration
  payload-types.ts      # Auto-generated — never edit manually
  cssVariables.js       # Breakpoint values shared with JS
wiki/                   # Project documentation (brand guide, audience, etc.)
```

---

## Component Conventions

### Server vs Client
- Default to **server components** (no `'use client'`)
- Add `'use client'` only when using hooks, event handlers, or browser APIs
- Client component files are named `Component.client.tsx` to make the split explicit

### Naming
- Component files: `PascalCase` in an `index.tsx` inside a named folder
  - `src/components/Card/index.tsx` → imported as `@/components/Card`
- One component per file. No barrel exports unless for a folder's public API.
- Utility files: `camelCase.ts`

### Class merging
Always use `cn()` for combining Tailwind classes — never string concatenation:
```ts
import { cn } from '@/utilities/ui'
className={cn('base-class', condition && 'conditional-class', className)}
```

### Variant components
Use CVA for components with multiple variants:
```ts
import { cva } from 'class-variance-authority'
const buttonVariants = cva('base-classes', {
  variants: { variant: { default: '...', outline: '...' } },
  defaultVariants: { variant: 'default' },
})
```

### shadcn/ui
Components live in `src/components/ui/` as source files — they can be freely edited. When adding a new shadcn component, copy it into that folder and adjust to match the design system tokens.

---

## Design System

### Design tokens
All tokens are CSS custom properties defined in `src/app/(frontend)/globals.css`.

**Do not use raw hex or OKLCH values in component files.** Always reference a token.

#### Brand colors (direct utilities)
| Token | Tailwind class | Value |
|---|---|---|
| Lime | `bg-lime` / `text-lime` | `#bbd644` |
| Lavender | `bg-lavender` / `text-lavender` | `#ccc2de` |
| Ink | `bg-ink` / `text-ink` | `#231f20` |
| Off-white | `bg-off-white` / `text-off-white` | near white |

#### Semantic color tokens (light/dark aware)
| Token | Usage |
|---|---|
| `background` / `foreground` | Page background and text |
| `primary` / `primary-foreground` | Main CTAs and buttons (ink in light, lime in dark) |
| `secondary` / `secondary-foreground` | Lavender tones |
| `accent` / `accent-foreground` | Lime highlights |
| `muted` / `muted-foreground` | Subdued text and backgrounds |
| `border` | All borders |
| `card` / `card-foreground` | Card surfaces |
| `ring` | Focus rings (lime) |
| `destructive` | Error states |
| `success`, `warning`, `error` | Status colors |

#### Typography tokens
The type scale is defined as CSS custom properties and consumed via Tailwind utilities:

| Token | Class | Size | Font | Weight |
|---|---|---|---|---|
| `--font-size-display` | `text-display` | 5rem–6rem | Expletus Sans | 700 |
| `--font-size-h1` | `text-h1` | 3.5rem–4rem | Expletus Sans | 700 |
| `--font-size-h2` | `text-h2` | 2.25rem–2.75rem | Expletus Sans | 700 |
| `--font-size-h3` | `text-h3` | 1.625rem–1.875rem | Mulish | 600 |
| `--font-size-h4` | `text-h4` | 1.25rem–1.375rem | Mulish | 600 |
| `--font-size-body-lg` | `text-body-lg` | 1.125rem | Mulish | 400 |
| `--font-size-body` | `text-body` | 1rem | Mulish | 400 |
| `--font-size-small` | `text-small` | 0.875rem | Mulish | 400 |
| `--font-size-label` | `text-label` | 0.75rem–0.8125rem | Mulish | 600, uppercase |

#### Border radius
| Token | Value | Usage |
|---|---|---|
| `--radius` | `0.25rem` (4px) | Base — architectural, precise |
| `--radius-sm` | 2px | Tight elements |
| `--radius-md` | 4px | Default |
| `--radius-lg` | 6px | Cards |
| `--radius-xl` | 10px | Modals |

#### Breakpoints
| Name | Value |
|---|---|
| `sm` | 40rem (640px) |
| `md` | 48rem (768px) |
| `lg` | 64rem (1024px) |
| `xl` | 80rem (1280px) |
| `2xl` | 86rem (1376px) |

### Dark mode
Dark mode is controlled by `data-theme="dark"` on `<html>`. All semantic tokens switch automatically. Use semantic tokens — not brand color utilities — for anything that should adapt to dark mode.

### Layout
- Use the `.container` utility class for page-level horizontal padding and max-width
- 12-column grid for complex layouts: `grid grid-cols-12 gap-4`
- Sections use generous vertical padding: `py-16 md:py-24 lg:py-32`

---

## Payload CMS

### Collections
| Slug | Purpose |
|---|---|
| `pages` | Flexible page builder pages |
| `posts` | Blog / news articles |
| `projects` | Portfolio work items (linked to services) |
| `ventures` | Studio initiatives and ventures |
| `media` | Image and video uploads |
| `categories` | Taxonomy for posts |
| `users` | Admin authentication |

### Globals
- `Header` — navigation config
- `Footer` — footer links config

### Key rules
- After changing any collection or field schema, run `pnpm payload generate:types` to regenerate `payload-types.ts`
- Never edit `payload-types.ts` manually
- Use `authenticatedOrPublished` access control for public-facing collections
- Rich text uses the Lexical editor (`defaultLexical` from `@/fields/defaultLexical`)
- Revalidation hooks live alongside each collection in `hooks/revalidate[Collection].ts`

### Live preview
Breakpoints configured in `payload.config.ts`: Mobile (375px), Tablet (768px), Desktop (1440px).

---

## TypeScript

- Strict mode is on — no `any` without justification
- Import paths use `@/` alias for `src/`
- Payload-generated types live in `payload-types.ts` — use them for all CMS data
- React component props: define as `interface Props` in the same file

---

## Brand Reference

Full brand guide: `wiki/brand-guide.md`

Quick reference:
- **Voice**: Direct, curious, grounded in place, human, quietly confident
- **Visual language**: Whitespace-first, bold typographic hierarchy, images primary, precise geometry
- **Do not** use rounded corners beyond `--radius-xl`, drop shadows, or decorative gradients
- **Fonts**: Expletus Sans for headlines only, Mulish for all body and UI text
