/**
 * optimize-media.mjs
 *
 * Copies all images from public/images/ and public/assets/ into public/media/,
 * organized by project/venture, with clean filenames and optimized at:
 *   - max 2500px on the longest side
 *   - JPEG quality 88
 *   - PNG files that are illustrations/logos are kept as PNG (not converted)
 *
 * Run from the project root:
 *   node scripts/optimize-media.mjs
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const MAX_PX = 2500
const JPEG_QUALITY = 88

/** Convert a filename to a clean slug: lowercase, spaces → hyphens, remove special chars */
function cleanFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '')
    .replace(/-+/g, '-')
}

/**
 * Process a single image file:
 * - Skip if destination already exists and is newer than source
 * - Resize to max 2500px
 * - Output as JPEG q88 (or PNG if source is PNG illustration)
 */
async function processImage(srcPath, destPath) {
  // Check if dest already exists and is up to date
  try {
    const [srcStat, destStat] = await Promise.all([stat(srcPath), stat(destPath)])
    if (destStat.mtimeMs >= srcStat.mtimeMs) {
      console.log(`  skip (up to date): ${path.basename(destPath)}`)
      return
    }
  } catch {
    // dest doesn't exist — continue
  }

  const ext = path.extname(srcPath).toLowerCase()
  const isPng = ext === '.png'

  try {
    let pipeline = sharp(srcPath).rotate() // auto-rotate from EXIF

    const meta = await pipeline.metadata()
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0)

    if (longest > MAX_PX) {
      pipeline = pipeline.resize(
        meta.width > meta.height ? MAX_PX : null,
        meta.height >= meta.width ? MAX_PX : null,
        { fit: 'inside', withoutEnlargement: true }
      )
    }

    if (isPng) {
      // Keep PNG for illustrations/SVG-like graphics (logos, diagrams)
      await pipeline.png({ compressionLevel: 9 }).toFile(destPath)
    } else {
      await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(destPath)
    }

    const srcSize = (await stat(srcPath)).size
    const destSize = (await stat(destPath)).size
    const saving = Math.round((1 - destSize / srcSize) * 100)
    console.log(`  ✓ ${path.basename(destPath)} (${(destSize / 1024).toFixed(0)}KB, ${saving > 0 ? `-${saving}%` : `+${Math.abs(saving)}%`})`)
  } catch (err) {
    console.error(`  ✗ ${path.basename(srcPath)}: ${err.message}`)
  }
}

/**
 * Process all images in a source directory into a destination directory.
 * Skips PDFs, DS_Store, and non-image files.
 */
async function processDir(srcDir, destDir, recursive = false) {
  await mkdir(destDir, { recursive: true })

  let entries
  try {
    entries = await readdir(srcDir, { withFileTypes: true })
  } catch {
    console.warn(`  (skipping missing dir: ${srcDir})`)
    return
  }

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name)

    if (entry.isDirectory() && recursive) {
      await processDir(srcPath, path.join(destDir, cleanFilename(entry.name)), true)
      continue
    }

    if (!entry.isFile()) continue

    const ext = path.extname(entry.name).toLowerCase()
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue

    const cleanName = cleanFilename(path.basename(entry.name, ext)) + (ext === '.png' ? '.png' : '.jpg')
    const destPath = path.join(destDir, cleanName)
    await processImage(srcPath, destPath)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const jobs = [
  // Projects
  {
    label: 'connect-tviste (kajeka slides)',
    src: 'public/images/projects/kajeka',
    dest: 'public/media/projects/connect-tviste',
  },
  {
    label: 'kotten-sauna',
    src: 'public/images/projects/kotten-sauna',
    dest: 'public/media/projects/kotten-sauna',
  },
  {
    label: 'kotten-changing-rooms',
    src: 'public/images/projects/kotten-changing-rooms',
    dest: 'public/media/projects/kotten-changing-rooms',
  },
  {
    label: 'rewilding-sweden-pavilion',
    src: 'public/images/projects/rewilding-sweden',
    dest: 'public/media/projects/rewilding-sweden-pavilion',
  },
  {
    label: 'umea-together',
    src: 'public/images/projects/umea-together',
    dest: 'public/media/projects/umea-together',
    recursive: true, // has a Presentation/ subfolder
  },
  {
    label: 'waste-to-wonder',
    src: 'public/images/projects/waste-to-wonder',
    dest: 'public/media/projects/waste-to-wonder',
  },

  // Ventures
  {
    label: 'dit-egnahem',
    src: 'public/images/ventures/dit-egnahem',
    dest: 'public/media/ventures/dit-egnahem',
  },
  {
    label: 'umea-kallbad',
    src: 'public/images/ventures/umea-kallbad',
    dest: 'public/media/ventures/umea-kallbad',
  },

  // Site / team
  {
    label: 'hero images',
    src: 'public/assets/hero',
    dest: 'public/media/site',
  },
  {
    label: 'team photos',
    src: 'public/assets/team',
    dest: 'public/media/team',
  },
  {
    label: 'team photos (images/team)',
    src: 'public/images/team',
    dest: 'public/media/team',
  },
]

console.log('Optimizing and organizing images into public/media/\n')
let total = 0

for (const job of jobs) {
  console.log(`→ ${job.label}`)
  const src = path.join(ROOT, job.src)
  const dest = path.join(ROOT, job.dest)
  await processDir(src, dest, job.recursive ?? false)
  total++
}

console.log(`\nDone. Processed ${jobs.length} folders.`)
console.log('Images are in public/media/ — commit them to git when ready.')
