# Localization Migration Plan

## Scope

This document applies to the current `main` branch, which uses:

- Payload CMS native localization (`en`, `sv`)
- `next-intl` for frontend UI strings
- One collection per content type (`projects`, `ventures`, `posts`, `pages`)

It does **not** describe the old Keystatic split-collection approach.

## Current state

### What is already good

- Payload localization is configured centrally in `src/payload.config.ts`
- Content is modeled as single collections with localized fields
- Frontend routes already carry locale in the URL (`/en/...`, `/sv/...`)
- Queries already pass locale through to Payload

### Main problems

1. **Silent fallback hides missing translations**
   - Payload is configured with `fallback: true`
   - Swedish pages can silently render English content
   - Editors may think a page is translated when it is not

2. **Some visitor-facing fields are not localized even though they should be**
   - Page hero copy is currently shared between languages
   - Some display fields such as `location` are shared, even when Swedish phrasing should differ

3. **Translation completeness depends on manual discipline**
   - The team guide says "always create both EN and SV"
   - The CMS does not enforce that at publish time

4. **Locale handling is repeated in query functions**
   - This is manageable now but gets fragile as rules evolve

## Decision

Keep Payload native localization as the architecture.

Do **not** migrate to separate per-locale collections.

The `@websolutespa/payload-plugin-localization` package may be worth testing later as an **admin UX enhancement**, but it should not become a required dependency for the core localization model unless it proves stable with:

- Lexical rich text
- blocks
- arrays
- SEO plugin fields
- drafts / versions / preview

## Target state

The improved localization system should have:

- One Payload collection per content type
- Localized fields only where the visitor sees language-specific copy
- Shared fields for slugs, media, booleans, ordering, relationships, IDs, and numeric metadata
- No silent frontend fallback for translated routes
- Clear publish-time checks for required translations
- One shared query layer for locale + fallback behavior
- `next-intl` used only for interface copy, not editorial content

## Concrete migration plan

### Phase 1 — Safe quick wins

#### 1. Localize missing page hero content

Update `src/heros/config.ts` so visitor-facing hero subfields are localized:

- `richText`
- CTA link labels inside `linkGroup`

Keep shared:

- `type`
- `media`

If `linkGroup` does not currently support localized labels, update the field factory so CTA text can be localized while URLs remain shared.

#### 2. Audit visitor-facing non-localized fields

Review `projects` and `ventures` and classify each field explicitly.

Should probably become localized:

- `location` if shown directly to visitors
- any future CTA text fields
- any display copy embedded in reusable groups

Should stay shared:

- `slug`
- `coverImage`
- gallery images
- `client` when it is a proper name
- `year`
- status enums
- `featured`
- `order`
- relationships

#### 3. Clarify bilingual content rules in admin descriptions

Add short admin descriptions on localized fields such as:

- "Required in both EN and SV before publish"
- "Swedish route should not rely on English fallback"

This is not enough on its own, but it reduces editor error immediately.

### Phase 2 — Stop silent fallback on the public site

#### 4. Introduce explicit fallback policy in query helpers

Refactor `src/lib/payload-queries.ts` so all frontend queries use shared helpers like:

- `findLocalized`
- `findOneLocalized`

Each helper should:

- pass `overrideAccess: false`
- pass `locale`
- explicitly set `fallbackLocale`

Recommended frontend rule:

- `en` requests may use normal default behavior
- `sv` requests should use `fallbackLocale: 'none'` or `false` for primary page content

That ensures untranslated Swedish content does not silently render in English.

#### 5. Define missing-translation behavior per route

For content pages (`projects`, `ventures`, `posts`, `pages`):

- if Swedish localized content is missing, return `notFound()` or a controlled unpublished state

For shared UI strings:

- continue using `next-intl`

For optional teaser areas:

- decide intentionally whether EN fallback is acceptable

Recommendation:

- main document body: no fallback
- marketing cards / listings: only fallback if explicitly approved

### Phase 3 — Enforce translation completeness in Payload

#### 6. Add publish-time validation for required locales

Create reusable validation/hook utilities, for example:

- `validateRequiredLocales`
- `hasRequiredLocaleContent`

Use them in `projects`, `ventures`, `posts`, and `pages`.

Rule:

- if `_status === 'published'`, required localized fields must be present in both `en` and `sv`

Per collection, define the required fields explicitly.

Example:

- `projects`: `title`, `tagline`, `description`
- `ventures`: `title`, `tagline`, `description`
- `posts`: `title`, `content`
- `pages`: `title`, hero copy, `layout`

This should fail validation before publish instead of letting fallback hide the gap.

#### 7. Add a lightweight translation-status field

Add a sidebar field such as:

- `activeLocales: ['en', 'sv']`

or:

- `translationStatus.en`
- `translationStatus.sv`

This should be editorial metadata, not the source of truth. The source of truth remains the actual localized fields.

Use it to:

- show editors what is expected
- optionally filter list views
- reduce ambiguity in workflow

### Phase 4 — Improve admin UX

#### 8. Consider Payload locale-status UI improvements

If supported by the current Payload version, test `experimental.localizeStatus` or similar locale-aware admin status tooling in development/staging first.

#### 9. Trial the localization plugin in a branch only

If the admin locale-switching experience still feels too cumbersome after Phases 1-3, create a test branch and evaluate:

- `@websolutespa/payload-plugin-localization`

Acceptance criteria for adoption:

- works with current Payload version
- works with Lexical editor
- works with localized arrays like `gallery[].caption`
- works with blocks and SEO fields
- does not interfere with drafts, versions, or preview
- does not create schema coupling that makes future Payload upgrades harder

If it only improves editor ergonomics, keep it optional and isolated.

## Suggested implementation order

1. Localize missing page hero fields
2. Localize any clearly visitor-facing fields like `location` where needed
3. Refactor query helpers to centralize locale/fallback behavior
4. Disable silent fallback for Swedish frontend content
5. Add publish-time validation for required localized fields
6. Add translation-status metadata in admin
7. Test Payload locale-status UI improvements
8. Trial the plugin only if admin UX is still not good enough

## Migration safety notes

- Take a database backup before changing field localization behavior
- After schema changes, generate and run Payload migrations
- Some field localization changes may require data backfill or editor re-save passes
- Test draft preview and live preview in both locales before shipping
- Test `/sv/...` routes specifically for accidental English leakage

## Acceptance criteria

The migration is complete when:

- editors manage EN and SV in the same document without guessing what is shared
- page heroes can differ per locale
- Swedish pages no longer silently render English body content
- publishing fails if required EN/SV translations are missing
- query code has one shared locale/fallback policy
- team documentation matches actual schema behavior
