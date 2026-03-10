/**
 * upload-media.mjs
 *
 * Resizes and uploads images from a local folder to the Payload CMS media library.
 * Optionally attaches uploaded images to a project's gallery.
 *
 * Usage:
 *   node scripts/upload-media.mjs <folder> [options]
 *
 * Options:
 *   --project-id <id>     Payload project ID to attach images to as gallery
 *   --url <base>          API base URL (default: https://new.parti.design)
 *   --email <email>       Payload admin email
 *   --password <pass>     Payload admin password
 *   --max-px <px>         Max dimension in pixels (default: 2500)
 *   --quality <q>         JPEG quality 1–100 (default: 88)
 *   --replace             Replace existing gallery instead of appending
 *
 * Example:
 *   node scripts/upload-media.mjs public/images/projects/kotten-sauna \
 *     --project-id 10 \
 *     --email kasimir@parti.design \
 *     --password secret
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.avif'])

// ─── Parse args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const folder = args[0]

if (!folder) {
  console.error('Usage: node scripts/upload-media.mjs <folder> [options]')
  process.exit(1)
}

function arg(name, def) {
  const i = args.indexOf(`--${name}`)
  return i !== -1 ? args[i + 1] : def
}
function flag(name) {
  return args.includes(`--${name}`)
}

const BASE_URL  = arg('url', 'https://new.parti.design')
const EMAIL     = arg('email', 'kasimir@parti.design')
const PASSWORD  = arg('password', '')
const PROJECT_ID = arg('project-id', null)
const MAX_PX    = parseInt(arg('max-px', '2500'), 10)
const QUALITY   = parseInt(arg('quality', '88'), 10)
const REPLACE   = flag('replace')

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) {
    console.error('Auth failed:', JSON.stringify(data))
    process.exit(1)
  }
  console.log(`✓ Authenticated as ${data.user.name}`)
  return data.token
}

// ─── Resize ───────────────────────────────────────────────────────────────────

async function resizeImage(filePath) {
  const img = sharp(filePath)
  const meta = await img.metadata()
  const { width, height } = meta

  const needsResize = width > MAX_PX || height > MAX_PX
  const ext = path.extname(filePath).toLowerCase()

  let pipeline = img

  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_PX,
      height: MAX_PX,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // Always output as JPEG for photos (strip metadata, consistent format)
  const buffer = await pipeline
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer()

  const origKB = Math.round(fs.statSync(filePath).size / 1024)
  const newKB  = Math.round(buffer.length / 1024)
  const saved  = needsResize
    ? ` (${width}×${height} → ≤${MAX_PX}px, ${origKB}KB → ${newKB}KB)`
    : ` (no resize needed, ${origKB}KB → ${newKB}KB after recompress)`

  return { buffer, savedNote: saved }
}

// ─── Upload ───────────────────────────────────────────────────────────────────

async function uploadFile(token, filename, buffer) {
  const boundary = `----FormBoundary${Math.random().toString(36).slice(2)}`
  const CRLF = '\r\n'

  const header = Buffer.from(
    `--${boundary}${CRLF}` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"${CRLF}` +
    `Content-Type: image/jpeg${CRLF}${CRLF}`
  )
  const footer = Buffer.from(`${CRLF}--${boundary}--${CRLF}`)
  const body = Buffer.concat([header, buffer, footer])

  const res = await fetch(`${BASE_URL}/api/media`, {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Origin': BASE_URL,
      'Referer': `${BASE_URL}/admin`,
    },
    body,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${JSON.stringify(data).slice(0, 200)}`)
  }
  return data.doc
}

// ─── Attach to project gallery ────────────────────────────────────────────────

async function attachToProject(token, projectId, mediaIds) {
  // Fetch existing gallery unless replacing
  let existing = []
  if (!REPLACE) {
    const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
      headers: { 'Authorization': `JWT ${token}` },
    })
    const data = await res.json()
    existing = (data.gallery ?? []).map((g) => ({ image: typeof g.image === 'object' ? g.image.id : g.image }))
  }

  const gallery = [...existing, ...mediaIds.map((id) => ({ image: id }))]

  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Origin': BASE_URL,
      'Referer': `${BASE_URL}/admin`,
    },
    body: JSON.stringify({ gallery }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Gallery update failed: ${JSON.stringify(data).slice(0, 200)}`)
  return data.doc.gallery.length
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const absFolder = path.resolve(folder)
  if (!fs.existsSync(absFolder)) {
    console.error(`Folder not found: ${absFolder}`)
    process.exit(1)
  }

  const files = fs.readdirSync(absFolder)
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .sort()

  if (files.length === 0) {
    console.error('No supported image files found in folder.')
    process.exit(1)
  }

  console.log(`\nFound ${files.length} image(s) in ${absFolder}`)
  console.log(`Max dimension: ${MAX_PX}px | JPEG quality: ${QUALITY}\n`)

  const token = await login()
  const uploadedIds = []

  for (const file of files) {
    const filePath = path.join(absFolder, file)
    process.stdout.write(`  Uploading ${file} ...`)

    try {
      const { buffer, savedNote } = await resizeImage(filePath)
      const doc = await uploadFile(token, file.replace(/\.[^.]+$/, '.jpg'), buffer)
      uploadedIds.push(doc.id)
      console.log(` ✓ [id:${doc.id}]${savedNote}`)
    } catch (err) {
      console.log(` ✗ ${err.message}`)
    }
  }

  console.log(`\nUploaded ${uploadedIds.length}/${files.length} images.`)

  if (PROJECT_ID && uploadedIds.length > 0) {
    process.stdout.write(`Attaching to project ${PROJECT_ID} gallery ...`)
    try {
      const count = await attachToProject(token, PROJECT_ID, uploadedIds)
      console.log(` ✓ Gallery now has ${count} image(s).`)
    } catch (err) {
      console.log(` ✗ ${err.message}`)
    }
  }

  console.log('\nDone.')
}

main()
