# Deploying Keystatic Branch on Coolify

## Overview

The `keystatic` branch runs without a database. Content lives in `src/content/` as
MDX/YAML files committed to git. Images live in `public/media/`, also committed.
Coolify builds a Docker image and starts the Next.js server — that's it.

---

## Step 1: Create a GitHub OAuth App

The Keystatic admin at `/keystatic` is secured with GitHub OAuth in production.
Anyone who needs to access it needs a GitHub account and repo access.

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name:** Parti Design CMS
   - **Homepage URL:** `https://parti.design`
   - **Authorization callback URL:** `https://parti.design/api/keystatic/github/oauth/callback`
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** and copy it

---

## Step 2: Create a new Coolify application

In Coolify, create a **new application** (don't update the existing Payload one — keep it running until the new one is verified).

- **Source:** GitHub → `parti-design/Parti-Design-Website`
- **Branch:** `keystatic`
- **Build pack:** Dockerfile

---

## Step 3: Set environment variables

In the new Coolify app, set these environment variables:

```
# Public URL — no trailing slash
NEXT_PUBLIC_SERVER_URL=https://parti.design

# Keystatic GitHub OAuth (from Step 1)
KEYSTATIC_GITHUB_CLIENT_ID=<your client id>
KEYSTATIC_GITHUB_CLIENT_SECRET=<your client secret>

# Random secret for Keystatic session signing
# Generate with: openssl rand -hex 32
KEYSTATIC_SECRET=<random hex string>

# GitHub repo details — used by Keystatic to commit content changes
KEYSTATIC_GITHUB_REPO_OWNER=parti-design
KEYSTATIC_GITHUB_REPO_NAME=Parti-Design-Website
```

**Remove these** (no longer needed without Payload/database):
- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `CRON_SECRET`
- `PREVIEW_SECRET`
- `UPLOAD_DIR` (images are now baked into the Docker image via public/media/)

---

## Step 4: Remove the Hetzner Volume mount

Since media files are now committed to git and baked into the Docker image,
the volume mount is no longer needed. Remove the `/app/public/media` volume
mount from the Coolify app settings.

> **Before removing:** make sure any images currently on the volume are
> committed to `public/media/` in the `keystatic` branch. Copy them locally
> first if needed.

---

## Step 5: Deploy

Click **Deploy** in Coolify. The build will:
1. Install dependencies (`pnpm install`)
2. Build the Next.js app (`pnpm build`)
3. Start the server (`next start`) — no migration step

---

## Step 6: Point the domain

Once the new app is running and verified, update the domain in Coolify to point
`parti.design` at the new application instead of the old Payload one.

---

## How content editing works in production

```
Edit content locally              Push to GitHub           Coolify auto-deploys
─────────────────────────────     ──────────────────────   ─────────────────────
1. pnpm dev                   →   git push origin          New Docker image built
2. Open localhost:3000/            keystatic            →   next start
   keystatic
3. Edit projects, ventures,
   posts in the visual UI
4. Keystatic saves MDX files
   to src/content/
5. Commit + push
```

Alternatively in GitHub mode (with OAuth configured on Keystatic), you can
edit content directly at `parti.design/keystatic` and Keystatic will commit
the changes to the repo via the GitHub API, which triggers a Coolify redeploy.

---

## How media / image uploads work

Images are stored in `public/media/` and committed to git.

**Workflow:**
1. Optimize the image first — run it through the upload script or ImageOptim
2. Place the file in `public/media/`
3. Commit and push — the image is deployed with the next build

**Or use Keystatic's image upload** in the local admin:
- In `pnpm dev`, go to `/keystatic`, edit a project, upload a cover image
- Keystatic saves it to `public/media/` automatically
- Commit the new file and push

**Size guidelines:**
- Target < 500KB per image after optimization
- Max dimension: 2500px (the upload script enforces this at q88 JPEG)
- Use `node scripts/upload-media.mjs` to batch-optimize before committing

---

## Startup command (reference)

The Dockerfile CMD is:
```
node_modules/.bin/next start
```

No database, no migrations. Just Next.js.
