# Parti Design — Brand Guide

This document defines the visual and communication standards for Parti Design. It is the reference for all design decisions on the website, presentations, and other materials.

## Active experiment (March 9, 2026)

The site currently has a temporary colorway test in code:

- Accent/action color shifted from lime to orange-red
- Secondary color shifted from lavender to lilac

Implementation note:

- Token aliases remain the same in code (`--color-lime`, `--color-lavender`) so existing component classes continue to work.

---

## Brand Essence

**Parti Design** is a multidisciplinary architecture and design studio that develops regenerative places through digital, physical, and social systems.

The name carries three meanings:
- A playful pushback against the self-serious architecture world
- A reference to **participatory design** — a core methodology
- A reference to **Parti Pris** — the French concept diagram that drives an architectural idea

### The tension to hold

Approachable, playful, and creative — while also communicating the reliability and credibility that municipalities and large institutional clients require before committing.

---

## Colors

### Core palette

| Name | Hex | OKLCH | Usage |
|------|-----|-------|-------|
| **Lime** | `#bbd644` | `oklch(82% 0.178 122deg)` | Primary accent, energy, CTAs, highlights |
| **Lavender** | `#ccc2de` | `oklch(80% 0.065 292deg)` | Secondary, softness, backgrounds, community feel |
| **Ink** | `#231f20` | `oklch(16% 0.006 8deg)` | Primary text, logo marks, structural elements |

> **Note:** Beyond Lime and Lavender, the brand uses bright accent colors freely — the goal is vibrancy and catching the eye, not a fixed third swatch. When choosing ad-hoc accent colors (for presentations, section backgrounds, campaign materials), keep them vivid and saturated. They do not need to be added to the CSS token system unless they become recurring.

### Extended palette (tints and shades)

These are computed from the core palette for use in UI, backgrounds, and subtle variations.

| Name | OKLCH | Usage |
|------|-------|-------|
| Lime light | `oklch(95% 0.06 122deg)` | Pale lime tints, hover states |
| Lime dark | `oklch(55% 0.18 122deg)` | Lime on white at higher contrast |
| Lavender light | `oklch(95% 0.02 292deg)` | Card backgrounds, muted areas |
| Lavender dark | `oklch(50% 0.07 292deg)` | Stronger lavender accents |
| Ink light | `oklch(40% 0.007 8deg)` | Secondary text, captions |
| Off-white | `oklch(98% 0.003 90deg)` | Page background (slightly warm) |

### Color usage rules

- **Lime** is the action color. Use it for primary buttons, links, hover states, and highlights. Never use it for large background areas on the main site (it's too loud for paragraphs of text).
- **Lavender** creates the gentle, community-oriented warmth. Use it for card backgrounds, section washes, and supporting elements.
- **Ink** is the default text and structural color. Use it for all body text, headings, borders, and icons.
- **Off-white** is the page background — warmer than pure white, never stark.
- Do not use pure black (`#000000`) or pure white (`#ffffff`) for text/backgrounds. Use Ink and Off-white instead.

### Accessibility

- Lime on Ink: contrast ratio ≈ 8.5:1 — passes AAA
- Ink on Off-white: contrast ratio ≈ 16:1 — passes AAA
- Lavender on Ink: contrast ratio ≈ 8.2:1 — passes AAA
- Lime on Off-white: contrast ratio ≈ 5.5:1 — passes AA (not AAA — use larger text or Ink on Lime instead for small text)

### Dark mode

In dark mode, the palette inverts:
- Background becomes near-Ink
- Lime becomes the primary interactive color (on dark it pops)
- Lavender tints appear as dark desaturated versions
- Theme switching in the site chrome uses a single icon-only toggle in the header beside the language switcher; avoid duplicate theme controls elsewhere in the layout

---

## Typography

### Headline typeface: Expletus Sans

**Expletus Sans** is used for display text, hero statements, and large headings. It has a distinctive, open letterform that carries visual personality without being decorative for its own sake.

- Google Fonts: `Expletus Sans`
- Import weights: 400, 500, 600, 700
- Use at h1 size and above; at smaller sizes defer to Mulish
- Do not use for body text or UI labels

### Body typeface: Mulish

**Mulish** (formerly Muli) is used for all body text, UI, subheadings, and supporting copy.

- Google Fonts: `Mulish`
- Import weights: 400, 500, 600, 700, 800
- Do not use italic except for quotes and editorial callouts

### Logo typeface

The custom typeface visible in the logo is for the logo mark only. It must never appear anywhere else in the website, documents, or presentations.

### Type scale

Use this scale consistently. Sizes shown are at desktop; mobile should use the next step down.

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 80–96px | 700 | 1.0 | Hero statements only — **Expletus Sans** |
| `h1` | 56–64px | 700 | 1.05 | Page titles — **Expletus Sans** |
| `h2` | 36–44px | 700 | 1.1 | Section headings — **Expletus Sans** |
| `h3` | 26–30px | 600 | 1.2 | Subsection headings |
| `h4` | 20–22px | 600 | 1.3 | Card titles, labels |
| `body-lg` | 18px | 400 | 1.65 | Lead paragraphs, intros |
| `body` | 16px | 400 | 1.65 | Default body text |
| `small` | 14px | 400 | 1.5 | Captions, metadata, footnotes |
| `label` | 12–13px | 600 | 1.4 | All-caps labels, tags, categories |

### Typography rules

- **Headlines are heavy.** Use weight 700 or 800. The presentation demonstrates this: big, bold, confident statements.
- **Body text is comfortable.** Weight 400 at 16–18px. Never go below 400.
- **All-caps labels** (categories, tags, metadata) use weight 600 at 12–13px with `letter-spacing: 0.06em`.
- **Quote pull-outs** can use weight 400 italic at h3 size.
- Headlines should never be sentence-case for long titles — use title case or single impactful statements.

---

## Logo

### Forms

The logo has two forms:
1. **Full mark** — the stacked "Parti" + "Design" with the two ellipses and all decorative elements
2. **Compact mark** — the smaller version used in slide footers

### Usage rules

- Always use the provided SVG files. Never recreate the logo from scratch.
- Minimum clear space: equal to the height of the letter "P" on all sides
- Minimum size: 80px wide for digital; 20mm for print
- The logo is always on a light background or transparent. If placed on a dark background, use the version with the elements set to off-white/white.
- Do not rotate, distort, recolor, or add effects to the logo
- The custom logo typeface is embedded in the SVG — do not attempt to set it in type

### Background pairings

- Lime background: use Ink logo
- Lavender background: use Ink logo
- Ink/dark background: use Off-white or white logo version
- Off-white/white background: use standard Ink logo

---

## Visual language

### Overall aesthetic

Reference studios that demonstrate the target aesthetic:
- [spaceandmatter.nl](https://spaceandmatter.nl) — clean, editorial, generous whitespace
- [darkmatterlabs.org](https://darkmatterlabs.org) — mission-forward, typographically strong
- [bttr.agency](https://www.bttr.agency/) — confident, minimal, brand-coherent

### Layout principles

- **Generous whitespace.** Architecture studios breathe. Don't crowd content.
- **Bold typographic hierarchy.** The headline does the heavy lifting. Body text supports.
- **Images are primary.** The portfolio is the proof. Images should be large, full-width where appropriate.
- **Grid-aligned.** Use consistent column grids. 12-column at desktop, 4-column at mobile.
- **Minimal decoration.** No gratuitous icons, no shadow overload. Let content and color carry the design.

### Radius

Use `0.5rem` (8px) corner radius across the UI — the shadcn default. Consistent with the component library baseline.

### Photography and imagery

- Show real people, real places, real process. Not stock.
- Co-building photos: celebrate the community and the physical making — hands, tools, people together
- Architectural drawings and diagrams: use the clean illustrated style seen in the DIT Egnahem and Umeå Kallbad materials
- Color photography can be full-bleed; black-and-white is appropriate for historic or documentary shots

---

## Voice and tone

### Brand voice

- **Direct.** Say what you mean. No jargon for its own sake.
- **Curious and propositional.** Ask big questions. Offer concrete ideas.
- **Grounded in place.** Reference Umeå, the river, the climate, the community. This practice is rooted somewhere.
- **Human.** Use "we" and "you." Avoid the third person architectural voice.
- **Quietly confident.** Don't oversell. Let the work speak.

### Key phrases worth preserving

- "Citizens are the experts of place" — strong, use it or build on it
- "Regenerative" — use it, but explain it. Not everyone knows the term.
- "Co-building" / "Co-design" — explain these too; don't assume familiarity
- "Living process" / "living system" — good framing for the philosophy

### Things to avoid

- Jargon without explanation ("regenerative," "participatory," "placemaking" should always be unpacked)
- Self-congratulatory language ("we are passionate about...")
- Over-long sentences in hero/heading positions
- Swedish terms without English context (except where deliberate, e.g. "byggemenskap")

---

## CSS implementation

The brand tokens are implemented as CSS custom properties in `src/app/(frontend)/globals.css`. They integrate with the Tailwind v4 `@theme` system.

### Direct brand color utilities

These are available as Tailwind utility classes:

```
bg-lime        text-lime        border-lime
bg-lavender    text-lavender    border-lavender
bg-ink         text-ink         border-ink
bg-cobalt      text-cobalt      border-cobalt      (pending hex confirmation)
bg-off-white   text-off-white
```

### Semantic tokens

Standard shadcn-compatible semantic tokens map to brand colors:

| Token | Light mode | Dark mode |
|-------|-----------|-----------|
| `--background` | Off-white | Near-ink |
| `--foreground` | Ink | Off-white |
| `--primary` | Ink | Lime |
| `--secondary` | Lavender | Dark lavender |
| `--accent` | Lime | Lime |
| `--muted` | Pale lavender | Dark lavender-ink |
| `--border` | Light lavender | Dark lavender-ink |
| `--ring` | Lime | Lime |

### Fonts

- `--font-display` → Expletus Sans — use as `font-display` Tailwind class on headings
- `--font-sans` → Mulish — default body and UI font, applied globally to `body`

Both are loaded via `next/font/google` in `layout.tsx`.
