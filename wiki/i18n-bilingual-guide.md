[← Wiki Home](./README.md)

**i18n:** [Localization Migration Plan](./localization-migration-plan.md)

**See also:** [Content Management](./content-management.md)

---

# Bilingual Content Guide (English + Swedish)

This site is fully bilingual: **English (`/en/...`)** and **Swedish (`/sv/...`)**.

All new content must be created and maintained in both languages.

---

## Rule: Always create content in both EN and SV

When creating or updating any content — whether in code, CMS, or translation files — always provide both English and Swedish versions simultaneously.

---

## 1. CMS Content (Payload Admin)

When adding or editing content in the Payload admin panel:

1. Open the document (project, venture, post, page)
2. Look for the **locale switcher** at the top of the admin panel (EN / SV tabs)
3. Fill in all localized fields in **English first**
4. Switch to **SV** and fill in all the same fields in Swedish
5. Save and publish in both locales

**Localized fields** (must be filled in both languages):
- `title`
- `tagline`
- `description` (rich text)
- `content` / `layout` (rich text / blocks)
- `gallery[].caption`
- `meta.title`, `meta.description` (SEO)

**Non-localized fields** (fill once, shared across languages):
- `slug` — keep in English, lowercase, hyphenated (e.g. `dit-egnahem`)
- `coverImage`, `gallery[].image` — images are shared
- `client`, `location`, `year` — proper nouns / numbers
- `services`, `status`, `featured`, `order` — select/checkbox fields

---

## 2. UI Strings (Translation Files)

Hardcoded UI text lives in:
- `messages/en.json` — English strings
- `messages/sv.json` — Swedish strings

When adding new UI text to a component:

1. **Do not hardcode strings directly** in `.tsx` files
2. Add the key + English value to `messages/en.json`
3. Add the same key + Swedish translation to `messages/sv.json`
4. Use `getTranslations()` in server components or `useTranslations()` in client components

**Example:**

```json
// messages/en.json
{
  "mySection": {
    "heading": "Our approach"
  }
}

// messages/sv.json
{
  "mySection": {
    "heading": "Vår metod"
  }
}
```

```tsx
// Server component
const t = await getTranslations('mySection')
return <h2>{t('heading')}</h2>

// Client component
const t = useTranslations('mySection')
return <h2>{t('heading')}</h2>
```

---

## 3. New Pages / Routes

When adding a new page:

1. Add the page file inside `src/app/(frontend)/[locale]/your-page/page.tsx`
2. Use `params: Promise<{ locale: string }>` and extract locale
3. Pass locale to any Payload queries
4. Add page metadata keys to both `messages/en.json` and `messages/sv.json`
5. Use `generateMetadata` with `getTranslations` for locale-aware SEO

---

## 4. Swedish Tone of Voice

Keep translations natural, not literal. Key principles:
- Informal but professional ("du"-form, not "ni")
- "Byggemenskap" stays as-is (Swedish term, no translation needed)
- Umeå, Sverige (not "Umeå, Sweden") in Swedish context
- "Arkitektur" not "Architecture", "Co-design" can stay or become "samdesign"

---

## 5. Fallback Behaviour

Payload CMS has `fallback: true` — if a Swedish translation is missing, it serves the English content. This means you can publish in English first and add Swedish later without breaking the Swedish site. But the goal is always full translation.

---

## 6. Frontend Technical Note

Shared translated UI that renders in the frontend shell, such as the site header or locale switcher, must be wrapped by `NextIntlClientProvider` in `src/app/(frontend)/layout.tsx`.

Do not place the provider only inside `src/app/(frontend)/[locale]/layout.tsx` if translated client components also render from the parent layout, or `useTranslations()` will fail at runtime.

Also note: locale-aware routing does not translate hardcoded page copy. If a page component contains inline English strings, `/sv/...` will still show English even when the route and metadata are localized. All frontend copy must come from `messages/en.json` and `messages/sv.json`.

Because Payload localization is configured with `fallback: true`, missing Swedish CMS content will silently fall back to English. When `/sv/...` shows English body content but the surrounding UI is translated, check the document in Payload admin and fill the missing SV fields.
