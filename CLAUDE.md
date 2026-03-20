# Parti Design Website — Claude Instructions

## Bilingual Content Rule (ALWAYS FOLLOW)

This site is fully bilingual: English (`en`) and Swedish (`sv`).

**Whenever you generate, edit, or suggest content:**
1. Always provide both English and Swedish versions
2. For UI strings: update both `messages/en.json` AND `messages/sv.json`
3. For CMS content guidance: instruct editors to fill in both EN and SV locales in Payload admin
4. For new page metadata: add keys to both translation files

See `wiki/i18n-bilingual-guide.md` for the full guide.

## Key Conventions

- Slugs are always in English, lowercase, hyphenated (e.g. `dit-egnahem`)
- Images, media, and select fields are shared across locales (not duplicated)
- In English, use "Community Led Housing" — in Swedish, use "Byggemenskap"
- Swedish uses informal "du"-form

## Tech Stack

- Next.js 15 App Router + Payload CMS v3
- next-intl v4 for i18n (routing + UI translations)
- Translation files: `messages/en.json`, `messages/sv.json`
- Locale routing: `src/i18n/routing.ts`
- All frontend pages under `src/app/(frontend)/[locale]/`
