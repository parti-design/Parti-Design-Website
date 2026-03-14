# Coolify Deployment Notes

This project runs a Next.js + Payload app with:

- PostgreSQL database (external service, configured via `DATABASE_URL`)
- Local filesystem media uploads (Payload `media` collection)

## Persistent Storage (Critical)

Uploaded images/files are stored on disk, not in the database.  
To avoid data loss on redeploy/restart, mount a persistent volume and point `UPLOAD_DIR` to it.

- Container path to persist: `/app/public/media`
- Environment variable: `UPLOAD_DIR=/app/public/media`

Why this path:

- `src/collections/Media.ts` sets `upload.staticDir` to `process.env.UPLOAD_DIR`
- Docker runtime `WORKDIR` is `/app`
- Frontend serves media from `/media/*`, which maps to `public/media`

## Coolify App Settings

Set these environment variables at minimum:

- `DATABASE_URL=postgresql://...`
- `PAYLOAD_SECRET=<long-random-secret>`
- `NEXT_PUBLIC_SERVER_URL=https://your-domain.com`
- `UPLOAD_DIR=/app/public/media`
- `CRON_SECRET=<long-random-secret>`
- `PREVIEW_SECRET=<long-random-secret>`

Then add one persistent volume mount:

- Source: your Coolify persistent storage (named volume or host path)
- Destination (inside container): `/app/public/media`

## Verification After Deploy

1. Open `/admin` and upload an image.
2. Confirm it loads from `/media/<filename>`.
3. Trigger a redeploy.
4. Confirm the same media URL still works.

If the file disappears after redeploy, the volume destination or `UPLOAD_DIR` is incorrect.

## Common issue: "There was a problem while uploading the file."

Most common cause in Coolify: the mounted volume is not writable by the app user (`nextjs`, uid `1001`).

What to do:

1. Ensure the image creates `/app/public/media` and assigns ownership to `nextjs:nodejs`.
2. If a volume was already created with wrong ownership, recreate that volume (or manually `chown` it on the server).

Tip:

- A volume created before ownership fixes can stay broken even after redeploy, because volume data/permissions persist.

## Project and venture detail routes

Project and venture detail pages use on-demand static generation.

Important i18n requirement:

- `src/app/(frontend)/[locale]/layout.tsx` must call `setRequestLocale(locale)` and load translations with `getMessages({ locale })`
- `src/app/(frontend)/layout.tsx` must stay free of dynamic server APIs like `draftMode()` and `getLocale()`

Without that, on-demand detail routes can fail in production with `DYNAMIC_SERVER_USAGE`, even though preview mode still works.

## Bundled homepage and studio images

The homepage hero and the studio team photo are bundled local assets under `public/assets`.

Keep these pages on `next/image` rather than raw `<img>` tags. Otherwise Next.js will serve the original files directly from `public/`, bypass responsive image optimization and causing large downloads in production.

## Runtime image files

The production runner image must include the top-level `messages/` directory.

Reason:

- `src/i18n/request.ts` loads translations at runtime via `../../messages/${locale}.json`
- statically generated pages can hide this during build, but on-demand routes like project and venture detail pages will fail in production if `messages/` is missing from the runtime container
