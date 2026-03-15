# Payload Admin UI Plan

## Goal

Make the Payload admin feel more intentional, branded, and pleasant to use without turning it into a fragile fork of Payload's UI.

The target tone should match the Parti Design brand:

- professional enough for real client work
- warmer and more playful than stock Payload
- subtle, not flashy
- more spacious and tactile

## Constraint

Payload does not expose a single high-level "theme object" for admin styling.

The best customization model is:

1. **CSS variables / theme tokens**
   - Use Payload's existing admin CSS variables and radius variables first
   - Override only what improves consistency

2. **Global SCSS**
   - Use `@payloadcms/ui/scss`
   - Layer branded styling over Payload's existing structure instead of rewriting everything

3. **Targeted admin component injection**
   - Use `admin.components` in `payload.config.ts`
   - Inject custom pieces only where there is strong UX value

4. **Full replacement only when necessary**
   - Avoid replacing core admin views unless there is a clear functional payoff

## Visual direction

Use the Parti Design brand guide as the source of truth.

Admin UI visual principles:

- **Ink** remains the structural base color
- **Lavender** is used for soft surfaces, section grouping, and hover washes
- **Lime** is used for active state, focus state, and success energy
- rounding should feel softer than stock Payload
- motion should be short, meaningful, and mostly hover/entrance based
- avoid loud gradients, glossy effects, or over-styled shadows

This should feel like "Payload, but clearly Parti Design" rather than a totally different app.

## Recommended styling architecture

### Layer 1 — Global admin theme file

Create and maintain a single admin theming entry point, for example:

- `src/components/AdminTheme/index.tsx`
- `src/components/AdminTheme/index.scss`

This component should:

- render `null`
- exist only to import global SCSS for the admin app

Use it via `admin.components.beforeNavLinks` or another stable root injection point.

### Layer 2 — Theme variables

In the admin SCSS, define a small Parti-specific token layer on top of Payload variables:

- Parti lime
- Parti lavender
- Parti ink
- radius values
- motion timing values
- optional shadow values

Prefer overriding:

- `--style-radius-s`
- `--style-radius-m`
- selected `--theme-*` usages through component styling

Do not try to replace every Payload token globally at once.

### Layer 3 — Structural shell styling

Use global SCSS to improve:

- app background
- header polish
- sidebar nav spacing
- card surfaces
- button hover states
- input rounding / focus states

This layer should do most of the visual work.

### Layer 4 — Purpose-built custom components

Use custom components only where the stock admin experience is actively weak:

- dashboard content
- nav extras
- login screen copy / presentation
- custom row labels
- custom list headers

Avoid replacing:

- full collection edit views
- core form field primitives
- document controls

unless there is a specific workflow problem to solve.

## Concrete roadmap

### Phase 1 — Low-risk visual polish

Purpose:
Improve the admin feel immediately with minimal maintenance burden.

Work:

1. Remove template-style welcome messaging from dashboard
2. Add a global admin theme component and SCSS entry point
3. Increase corner rounding slightly across cards, buttons, and inputs
4. Add subtle background wash using Parti lavender / lime tints
5. Improve hover / focus / active transitions for nav and buttons
6. Restyle left sidebar links as pill-like buttons with more spacing
7. Improve selected nav item state so it is clearer and more branded

Success criteria:

- admin feels less template-like
- sidebar is easier to scan
- interaction targets feel larger and calmer

### Phase 2 — Better dashboard UX

Purpose:
Make `/admin` useful instead of empty.

Work:

1. Replace the stock dashboard intro with a custom Parti dashboard
2. Add a compact quick-actions area:
   - New project
   - New venture
   - New post
   - Edit header / footer
3. Add a "recently edited" or "recent content" section
4. Add a content health strip:
   - drafts waiting
   - untranslated documents
   - missing featured images

Implementation note:

- Use custom admin dashboard components
- Keep layout simple and editorial, not widget-heavy

Success criteria:

- admin homepage becomes a useful control room
- editors know what to do next when they log in

### Phase 3 — Editing experience polish

Purpose:
Make collection edit screens feel more refined and easier to parse.

Work:

1. Improve spacing and grouping of tabs, arrays, and collapsibles
2. Soften sidebar field panels and metadata sections
3. Improve visual distinction between:
   - content fields
   - sidebar metadata
   - SEO sections
4. Make rich text / block editing areas feel cleaner and less cramped
5. Add subtle motion for collapsible open/close states where safe

Success criteria:

- edit screens feel calmer
- editors can visually parse long documents faster

### Phase 4 — Brand-specific touches

Purpose:
Push the admin from "polished" to "owned by Parti Design."

Work:

1. Add custom admin logo / mark
2. Improve login screen styling and copy
3. Add lightweight branded touches to empty states
4. Consider custom icons or section markers for key content areas

Success criteria:

- the admin feels recognizably Parti
- branding improves trust without becoming distracting

## Interaction guidelines

### Motion

Use only a few motion patterns:

- fade + small upward translate on page entry
- 2px horizontal lift on nav hover
- very short button / card shadow transitions
- soft accordion open/close where already supported

Avoid:

- bounce
- long spring animations

## Current admin-content mismatch to fix

The new venture detail pages currently mix two content sources:

- Payload CMS fields from the `ventures` collection
- repo-backed fallback narrative content in `src/lib/venture-drafts.ts`

This creates a misleading editing experience in admin:

- the `description` field is labeled `Main Page Text`
- but the live venture page can still show substantial narrative copy even when that field is empty
- specifically, the titled narrative sections such as "what it does" and "how Parti supports this venture" are currently rendered from repo fallback content rather than editable CMS fields

Chosen fix:

1. Use the existing localized `description` field (`Main Page Text`) as the only source of venture body copy
2. Remove the split repo-driven narrative sections from the frontend
3. Let editors create their own headings inside the rich text field when section structure is needed

This keeps the venture model simple and makes the admin field match what appears on the page.

Implementation note:

- local venture records may still contain legacy preset values like `lime`, `lavender`, or `ink` from the earlier theme select field
- the custom admin color picker should normalize those legacy values to hex so existing ventures remain editable without save errors
- changing the `themeColor` field from an enum-backed select to freeform hex text also requires a database migration, otherwise Payload saves will fail when writing values like `#bbd644`
- large transforms
- anything that makes the admin feel playful at the expense of speed

Status update:

- venture detail body copy is now expected to come from Payload `description` only
- venture detail SEO should read from Payload `meta.title` and `meta.description`
- any remaining repo-backed venture fallbacks on the public venture detail page should be treated as technical debt and removed so the live page matches admin exactly

### Radius

Recommended:

- slightly larger than stock Payload
- keep pills for nav items
- rounded rectangles for cards / surfaces
- consistent values across the whole admin

Avoid mixing many different radii.

### Color

Recommended:

- lavender for grouping / washes
- lime for active states and focus
- ink for text and strong edges

Avoid large high-saturation fills behind large text blocks.

## What should be done with CSS vs components

### Use CSS / SCSS for

- spacing
- rounded corners
- hover states
- shadows
- selected nav styles
- app shell background
- card / form surface polish

### Use custom components for

- dashboard layout
- login message / helper content
- logo / graphics
- contextual nav additions
- custom empty states

### Avoid for now

- replacing the whole nav component
- replacing document edit root views
- replacing collection list views globally

Those are higher maintenance and not necessary for the first 80% improvement.

## Order of execution

1. Stabilize the new global admin theme entry point
2. Finish Phase 1 visual polish
3. Build a real custom dashboard
4. Improve edit-view grouping and spacing
5. Add brand-specific login / logo polish

## Acceptance criteria

The admin UI redesign is successful when:

- it still feels fast and recognizably Payload
- the sidebar is easier to scan and click
- the dashboard is useful, not decorative
- the visual language aligns with the Parti brand guide
- the custom layer is small enough to survive Payload upgrades without pain
