/**
 * import-keystatic-projects.mjs
 *
 * One-off importer that reads project content from the local `keystatic` git
 * branch and compares / imports it into the live Payload site over the REST API.
 *
 * Default mode is a dry run. In dry run, the script:
 * - reads project content from the source branch
 * - fetches current live projects from Payload
 * - reports creates / exact matches / conflicts / possible duplicates
 *
 * Apply mode is enabled with `--apply`. In apply mode, the script:
 * - logs into the live Payload API
 * - uploads any referenced media that is not already present
 * - creates projects that do not exist yet and have no duplicate warning
 *
 * Intentional safety behavior:
 * - existing projects with content differences are reported as conflicts
 * - possible duplicates are reported for review
 * - neither conflicts nor duplicate warnings are overwritten automatically
 *
 * Usage:
 *   node scripts/import-keystatic-projects.mjs --password <admin-password>
 *   node scripts/import-keystatic-projects.mjs --apply --password <admin-password>
 *   node scripts/import-keystatic-projects.mjs --slug kotten-sauna --password <admin-password>
 */

import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import sharp from 'sharp'

const DEFAULT_BASE_URL = 'https://new.parti.design'
const DEFAULT_BRANCH = 'keystatic'
const DEFAULT_EMAIL = 'kasimir@parti.design'
const MAX_GIT_BUFFER = 100 * 1024 * 1024
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.avif'])
const TITLE_STOP_WORDS = new Set([
  'and',
  'the',
  'for',
  'with',
  'from',
  'into',
  'over',
  'under',
  'through',
  'project',
  'study',
])

function usage() {
  console.log(`Usage:
  node scripts/import-keystatic-projects.mjs [options]

Options:
  --apply                 Write safe, non-conflicting creates to the live API
  --branch <name>         Source git branch (default: ${DEFAULT_BRANCH})
  --url <base>            Payload base URL (default: ${DEFAULT_BASE_URL})
  --email <email>         Payload admin email (default: ${DEFAULT_EMAIL})
  --password <password>   Payload admin password (required)
  --slug <slug>           Import only one project slug (repeatable)
  --report <file>         Write a JSON report to a file
  --decisions <file>      JSON decisions file for confirmed conflict handling
  --help                  Show this help

Examples:
  node scripts/import-keystatic-projects.mjs --password <secret>
  node scripts/import-keystatic-projects.mjs --apply --slug kotten-sauna --password <secret>
  node scripts/import-keystatic-projects.mjs --apply --decisions ./import-decisions.json --password <secret>
`)
}

function parseArgs(argv) {
  const options = {
    apply: false,
    branch: DEFAULT_BRANCH,
    url: DEFAULT_BASE_URL,
    email: DEFAULT_EMAIL,
    password: process.env.PAYLOAD_PASSWORD || '',
    slugs: [],
    reportFile: '',
    decisionsFile: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--help') {
      usage()
      process.exit(0)
    }
    if (arg === '--apply') {
      options.apply = true
      continue
    }
    if (arg === '--branch') {
      options.branch = argv[i + 1] || ''
      i += 1
      continue
    }
    if (arg === '--url') {
      options.url = argv[i + 1] || ''
      i += 1
      continue
    }
    if (arg === '--email') {
      options.email = argv[i + 1] || ''
      i += 1
      continue
    }
    if (arg === '--password') {
      options.password = argv[i + 1] || ''
      i += 1
      continue
    }
    if (arg === '--slug') {
      const value = argv[i + 1] || ''
      if (value) options.slugs.push(value)
      i += 1
      continue
    }
    if (arg === '--report') {
      options.reportFile = argv[i + 1] || ''
      i += 1
      continue
    }
    if (arg === '--decisions') {
      options.decisionsFile = argv[i + 1] || ''
      i += 1
      continue
    }

    console.error(`Unknown argument: ${arg}`)
    usage()
    process.exit(1)
  }

  if (!options.password) {
    console.error('A Payload admin password is required. Pass --password <value> or set PAYLOAD_PASSWORD.')
    process.exit(1)
  }

  return options
}

function gitText(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: MAX_GIT_BUFFER }).replace(/\r/g, '')
}

function gitBuffer(args) {
  return execFileSync('git', args, { encoding: null, maxBuffer: MAX_GIT_BUFFER })
}

function gitPathExists(branch, filePath) {
  try {
    execFileSync('git', ['cat-file', '-e', `${branch}:${filePath}`], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function readBranchText(branch, filePath) {
  return gitText(['show', `${branch}:${filePath}`])
}

function readBranchBuffer(branch, filePath) {
  return gitBuffer(['show', `${branch}:${filePath}`])
}

function listBranchPaths(branch, root) {
  return gitText(['ls-tree', '-r', '--name-only', branch, root])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function splitFrontmatter(fileText) {
  if (!fileText.startsWith('---\n')) {
    return { frontmatter: '', body: fileText.trim() }
  }

  const endIndex = fileText.indexOf('\n---\n', 4)
  if (endIndex === -1) {
    throw new Error('Frontmatter start found without a closing --- line.')
  }

  const frontmatter = fileText.slice(4, endIndex)
  const body = fileText.slice(endIndex + 5).trim()
  return { frontmatter, body }
}

function unquote(value) {
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1)
  }
  return value
}

function parseScalar(value) {
  const trimmed = value.trim()
  if (trimmed === '') return ''
  if (trimmed === '[]') return []
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed)
  return unquote(trimmed)
}

function parseFolded(lines, index) {
  const values = []
  let i = index

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      values.push('')
      i += 1
      continue
    }
    if (!line.startsWith('  ')) break
    values.push(line.trim())
    i += 1
  }

  const folded = values
    .join('\n')
    .split('\n\n')
    .map((chunk) => chunk.replace(/\n/g, ' ').trim())
    .join('\n\n')
    .trim()

  return [folded, i]
}

function parseScalarArray(lines, index) {
  const items = []
  let i = index

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }
    if (!line.startsWith('  - ')) break
    items.push(parseScalar(line.slice(4)))
    i += 1
  }

  return [items, i]
}

function parseCollaborators(lines, index) {
  const items = []
  let i = index

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }
    if (!line.startsWith('  - ')) break

    const item = {}
    const first = line.slice(4)
    const firstColon = first.indexOf(':')
    if (firstColon !== -1) {
      item[first.slice(0, firstColon).trim()] = parseScalar(first.slice(firstColon + 1))
    }
    i += 1

    while (i < lines.length) {
      const nested = lines[i]
      if (!nested.trim()) {
        i += 1
        continue
      }
      if (!nested.startsWith('    ')) break
      const colon = nested.trim().indexOf(':')
      if (colon !== -1) {
        const trimmed = nested.trim()
        item[trimmed.slice(0, colon).trim()] = parseScalar(trimmed.slice(colon + 1))
      }
      i += 1
    }

    items.push(item)
  }

  return [items, i]
}

function parseGallery(lines, index) {
  const items = []
  let i = index

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }
    if (!line.startsWith('  - ')) break

    const item = {}
    const first = line.slice(4)
    const firstColon = first.indexOf(':')
    if (firstColon !== -1) {
      const key = first.slice(0, firstColon).trim()
      const value = first.slice(firstColon + 1)
      item[key] = parseScalar(value)
    }
    i += 1

    while (i < lines.length) {
      const nested = lines[i]
      if (!nested.trim()) {
        i += 1
        continue
      }
      if (!nested.startsWith('    ')) break
      const trimmed = nested.trim()
      const colon = trimmed.indexOf(':')
      if (colon !== -1) {
        item[trimmed.slice(0, colon).trim()] = parseScalar(trimmed.slice(colon + 1))
      }
      i += 1
    }

    items.push(item)
  }

  return [items, i]
}

function parseProjectFrontmatter(frontmatterText) {
  const lines = frontmatterText.split('\n')
  const result = {}

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }
    if (line.startsWith(' ')) {
      throw new Error(`Unexpected indentation in frontmatter line: ${line}`)
    }
    const colon = line.indexOf(':')
    if (colon === -1) {
      throw new Error(`Unable to parse frontmatter line: ${line}`)
    }

    const key = line.slice(0, colon).trim()
    const rawValue = line.slice(colon + 1).trim()

    if (rawValue === '[]') {
      result[key] = []
      i += 1
      continue
    }

    if (rawValue === '>-') {
      const [value, nextIndex] = parseFolded(lines, i + 1)
      result[key] = value
      i = nextIndex
      continue
    }

    if (rawValue === '') {
      if (key === 'services' || key === 'relatedProjects') {
        const [value, nextIndex] = parseScalarArray(lines, i + 1)
        result[key] = value
        i = nextIndex
        continue
      }
      if (key === 'collaborators') {
        const [value, nextIndex] = parseCollaborators(lines, i + 1)
        result[key] = value
        i = nextIndex
        continue
      }
      if (key === 'gallery') {
        const [value, nextIndex] = parseGallery(lines, i + 1)
        result[key] = value
        i = nextIndex
        continue
      }

      result[key] = ''
      i += 1
      continue
    }

    result[key] = parseScalar(rawValue)
    i += 1
  }

  return result
}

function stripInlineMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function lexicalTextNode(text) {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function lexicalParagraph(text) {
  return {
    children: [lexicalTextNode(stripInlineMarkdown(text))],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function lexicalHeading(tag, text) {
  return {
    children: [lexicalTextNode(stripInlineMarkdown(text))],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    type: 'heading',
    version: 1,
  }
}

function markdownToLexical(markdown) {
  const body = (markdown || '').replace(/\r/g, '').trim()
  if (!body) return null

  const lines = body.split('\n')
  const nodes = []
  let paragraph = []

  function flushParagraph() {
    const text = paragraph.join(' ').trim()
    if (text) nodes.push(lexicalParagraph(text))
    paragraph = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      continue
    }

    const headingMatch = line.match(/^(#{2,4})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph()
      const level = headingMatch[1].length
      const tag = level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      nodes.push(lexicalHeading(tag, headingMatch[2]))
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()

  if (nodes.length === 0) return null

  return {
    root: {
      children: nodes,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

function stableJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((item) => stableJson(item)).join(',')}]`
  const keys = Object.keys(value).sort()
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`
}

function normalizeDate(value) {
  if (!value) return null
  const str = String(value)
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : str
}

function normalizeTitleForMatching(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function titleTokens(title) {
  return normalizeTitleForMatching(title)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !TITLE_STOP_WORDS.has(token))
}

function titleSimilarity(a, b) {
  const aTokens = new Set(titleTokens(a))
  const bTokens = new Set(titleTokens(b))
  if (aTokens.size === 0 || bTokens.size === 0) return 0

  let overlap = 0
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap += 1
  }
  return overlap / Math.min(aTokens.size, bTokens.size)
}

function sanitizeFilenamePart(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function makeUploadFilename(repoPath) {
  const relative = repoPath.replace(/^public\/media\//, '')
  const parsed = path.parse(relative)
  const stem = sanitizeFilenamePart(parsed.dir ? `${parsed.dir}-${parsed.name}` : parsed.name)
  return `${stem}.jpg`
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function isImagePath(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function resolveBranchMediaPath({ branch, availableMediaPaths, publicPath, slug }) {
  if (!publicPath) return null

  const cleaned = String(publicPath).trim()
  const candidates = []

  if (cleaned.startsWith('/')) {
    candidates.push(`public${cleaned}`)
  } else {
    candidates.push(cleaned)
  }

  if (cleaned.startsWith('/media/') && !cleaned.startsWith('/media/projects/')) {
    candidates.push(`public/media/projects/${cleaned.slice('/media/'.length)}`)
  }

  if (cleaned.startsWith('/media/') && !cleaned.startsWith('/media/ventures/')) {
    candidates.push(`public${cleaned}`)
  }

  const uniqueCandidates = [...new Set(candidates)]
  for (const candidate of uniqueCandidates) {
    if (availableMediaPaths.has(candidate) && gitPathExists(branch, candidate)) {
      return candidate
    }
  }

  if (slug) {
    const basename = path.basename(cleaned)
    const folderCandidates = [...availableMediaPaths].filter(
      (candidate) =>
        candidate.startsWith(`public/media/projects/${slug}/`) && path.basename(candidate) === basename,
    )
    if (folderCandidates.length === 1) return folderCandidates[0]
  }

  return null
}

function buildGalleryWithFallback({ branch, availableMediaPaths, slug, coverRepoPath, frontmatterGallery }) {
  const gallery = ensureArray(frontmatterGallery).map((item) => ({ ...item }))
  const explicitImageCount = gallery.filter((item) => item.image).length

  if (gallery.length === 0) {
    return { gallery: [], warnings: [] }
  }

  const warnings = []

  if (explicitImageCount === gallery.length) {
    return { gallery, warnings }
  }

  const projectFolder = `public/media/projects/${slug}/`
  const fallbackFiles = [...availableMediaPaths]
    .filter((candidate) => candidate.startsWith(projectFolder) && isImagePath(candidate))
    .filter((candidate) => candidate !== coverRepoPath)
    .sort()

  if (fallbackFiles.length < gallery.length) {
    warnings.push(
      `Gallery fallback found only ${fallbackFiles.length} image file(s) for ${gallery.length} gallery row(s).`,
    )
    return { gallery, warnings }
  }

  let fallbackIndex = 0
  for (const item of gallery) {
    if (item.image) continue
    item.image = fallbackFiles[fallbackIndex]
      .replace(/^public/, '')
      .replace(/^\/+/, '/')
    fallbackIndex += 1
  }

  warnings.push('Filled missing gallery image paths from sorted files in the project media folder.')
  return { gallery, warnings }
}

function normalizeSourceProject(source) {
  const fallbackSv = source.sv
    ? {
        title: source.sv.title || source.en.title || null,
        tagline: source.sv.tagline || source.en.tagline || null,
        description:
          source.sv.descriptionLexical || source.en.descriptionLexical
            ? stableJson(source.sv.descriptionLexical || source.en.descriptionLexical)
            : null,
        content:
          source.sv.contentLexical || source.en.contentLexical
            ? stableJson(source.sv.contentLexical || source.en.contentLexical)
            : null,
        metaTitle: source.sv.metaTitle || source.en.metaTitle || null,
        metaDescription: source.sv.metaDescription || source.en.metaDescription || null,
      }
    : null

  return {
    slug: source.slug,
    shared: {
      coverImageFilename: source.shared.coverImageRepoPath ? makeUploadFilename(source.shared.coverImageRepoPath) : null,
      client: source.shared.client || null,
      location: source.shared.location || null,
      year: source.shared.year ?? null,
      projectStatus: source.shared.projectStatus || null,
      services: ensureArray(source.shared.services),
      collaborators: ensureArray(source.shared.collaborators).map((item) => ({
        name: item.name || '',
        role: item.role || null,
      })),
      featured: Boolean(source.shared.featured),
      relatedProjects: ensureArray(source.shared.relatedProjects),
      publishedAt: normalizeDate(source.shared.publishedAt),
      gallery: ensureArray(source.shared.gallery).map((item) => ({
        filename: item.imageRepoPath ? makeUploadFilename(item.imageRepoPath) : null,
        captionEn: item.caption ?? null,
      })),
    },
    en: {
      title: source.en.title || null,
      tagline: source.en.tagline || null,
      description: source.en.descriptionLexical ? stableJson(source.en.descriptionLexical) : null,
      content: source.en.contentLexical ? stableJson(source.en.contentLexical) : null,
      metaTitle: source.en.metaTitle || null,
      metaDescription: source.en.metaDescription || null,
    },
    sv: source.sv
      ? fallbackSv
      : null,
  }
}

function normalizeLiveProject(doc) {
  if (!doc) return null
  return {
    slug: doc.slug,
    shared: {
      coverImageFilename:
        doc.coverImage && typeof doc.coverImage === 'object' ? doc.coverImage.filename || null : null,
      client: doc.client || null,
      location: doc.location || null,
      year: doc.year ?? null,
      projectStatus: doc.projectStatus || null,
      services: ensureArray(doc.services),
      collaborators: ensureArray(doc.collaborators).map((item) => ({
        name: item.name || '',
        role: item.role || null,
      })),
      featured: Boolean(doc.featured),
      relatedProjects: ensureArray(doc.relatedProjects).map((item) =>
        typeof item === 'object' && item ? item.slug || null : item,
      ),
      publishedAt: normalizeDate(doc.publishedAt),
      gallery: ensureArray(doc.gallery).map((item) => ({
        filename: item.image && typeof item.image === 'object' ? item.image.filename || null : null,
        captionEn: item.caption ?? null,
      })),
    },
    locale: {
      title: doc.title || null,
      tagline: doc.tagline || null,
      description: doc.description ? stableJson(doc.description) : null,
      content: doc.content ? stableJson(doc.content) : null,
      metaTitle: doc.meta?.title || null,
      metaDescription: doc.meta?.description || null,
    },
  }
}

function diffObjects(sourceValue, liveValue, prefix = '') {
  const diffs = []

  if (sourceValue === liveValue) return diffs

  const sourceIsObject = sourceValue && typeof sourceValue === 'object'
  const liveIsObject = liveValue && typeof liveValue === 'object'

  if (!sourceIsObject || !liveIsObject) {
    diffs.push({
      field: prefix || 'value',
      source: sourceValue,
      live: liveValue,
    })
    return diffs
  }

  if (Array.isArray(sourceValue) || Array.isArray(liveValue)) {
    const sourceJson = stableJson(sourceValue)
    const liveJson = stableJson(liveValue)
    if (sourceJson !== liveJson) {
      diffs.push({
        field: prefix || 'value',
        source: sourceValue,
        live: liveValue,
      })
    }
    return diffs
  }

  const keys = new Set([...Object.keys(sourceValue), ...Object.keys(liveValue)])
  for (const key of keys) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    diffs.push(...diffObjects(sourceValue[key], liveValue[key], nextPrefix))
  }
  return diffs
}

function findPotentialDuplicates(sourceProject, liveProjectsBySlug) {
  const matches = []
  const sourceTitle = sourceProject.en.title || ''

  for (const liveProject of liveProjectsBySlug.values()) {
    const score = titleSimilarity(sourceTitle, liveProject.en?.title || liveProject.title || '')
    if (score >= 0.6) {
      matches.push({
        id: liveProject.id,
        slug: liveProject.slug,
        title: liveProject.title,
        similarity: Number(score.toFixed(2)),
      })
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity)
}

function authHeaders(url, token, extras = {}) {
  return {
    Authorization: `JWT ${token}`,
    Accept: 'application/json',
    Origin: url,
    Referer: `${url}/admin`,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ...extras,
  }
}

async function login({ url, email, password }) {
  const res = await fetch(`${url}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok || !data.token) {
    throw new Error(`Authentication failed: ${JSON.stringify(data).slice(0, 300)}`)
  }
  return data.token
}

async function fetchPaginatedCollection({ url, token, collection, locale }) {
  const docs = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const params = new URLSearchParams({
      depth: '1',
      draft: 'true',
      limit: '100',
      locale,
      page: String(page),
    })
    const res = await fetch(`${url}/api/${collection}?${params}`, {
      headers: authHeaders(url, token),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(`Failed to fetch ${collection} (${locale}): ${JSON.stringify(data).slice(0, 300)}`)
    }
    docs.push(...(data.docs || []))
    hasNextPage = Boolean(data.hasNextPage)
    page += 1
  }

  return docs
}

async function findExistingMediaByFilename({ url, token, filename }) {
  const params = new URLSearchParams({
    depth: '0',
    limit: '1',
  })
  params.set('where[filename][equals]', filename)

  const res = await fetch(`${url}/api/media?${params}`, {
    headers: authHeaders(url, token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Failed to query media "${filename}": ${JSON.stringify(data).slice(0, 300)}`)
  }
  return data.docs?.[0] ?? null
}

async function uploadMediaBuffer({ url, token, filename, buffer }) {
  const boundary = `----FormBoundary${Math.random().toString(36).slice(2)}`
  const crlf = '\r\n'
  const header = Buffer.from(
      `--${boundary}${crlf}` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"${crlf}` +
      `Content-Type: image/jpeg${crlf}${crlf}`,
  )
  const footer = Buffer.from(`${crlf}--${boundary}--${crlf}`)
  const body = Buffer.concat([header, buffer, footer])

  const res = await fetch(`${url}/api/media`, {
    method: 'POST',
    headers: authHeaders(url, token, {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    }),
    body,
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Media upload failed for "${filename}": ${JSON.stringify(data).slice(0, 300)}`)
  }
  return data.doc
}

async function buildUploadBuffer(repoPath, sourceBuffer) {
  const ext = path.extname(repoPath).toLowerCase()

  if (!IMAGE_EXTENSIONS.has(ext)) {
    return sourceBuffer
  }

  return await sharp(sourceBuffer)
    .rotate()
    .resize({
      width: 2500,
      height: 2500,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer()
}

async function ensureMediaDocument({ url, token, branch, mediaCache, repoPath }) {
  if (!repoPath) return null
  if (mediaCache.has(repoPath)) return mediaCache.get(repoPath)

  const filename = makeUploadFilename(repoPath)
  const existing = await findExistingMediaByFilename({ url, token, filename })
  if (existing) {
    mediaCache.set(repoPath, existing)
    return existing
  }

  const sourceBuffer = readBranchBuffer(branch, repoPath)
  const buffer = await buildUploadBuffer(repoPath, sourceBuffer)
  const uploaded = await uploadMediaBuffer({ url, token, filename, buffer })
  mediaCache.set(repoPath, uploaded)
  return uploaded
}

async function createProject({ url, token, locale, payload }) {
  const res = await fetch(`${url}/api/projects?locale=${locale}`, {
    method: 'POST',
    headers: authHeaders(url, token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Project create failed (${locale}): ${JSON.stringify(data).slice(0, 400)}`)
  }
  return data.doc
}

async function patchProject({ url, token, id, locale, payload }) {
  const res = await fetch(`${url}/api/projects/${id}?locale=${locale}`, {
    method: 'PATCH',
    headers: authHeaders(url, token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Project patch failed for ${id} (${locale}): ${JSON.stringify(data).slice(0, 400)}`)
  }
  return data.doc
}

function buildSourceProject({ branch, availableMediaPaths, slug }) {
  const enPath = `src/content/projects/${slug}/en.mdx`
  const svPath = `src/content/projects/${slug}/sv.mdx`
  const enDescriptionPath = `src/content/projects/${slug}/en/description.mdx`
  const svDescriptionPath = `src/content/projects/${slug}/sv/description.mdx`

  const { frontmatter: enFrontmatterText, body: enBody } = splitFrontmatter(readBranchText(branch, enPath))
  const enFrontmatter = parseProjectFrontmatter(enFrontmatterText)

  let svFrontmatter = null
  let svBody = ''
  if (gitPathExists(branch, svPath)) {
    const parsed = splitFrontmatter(readBranchText(branch, svPath))
    svFrontmatter = parseProjectFrontmatter(parsed.frontmatter)
    svBody = parsed.body
  }

  const coverImageRepoPath = resolveBranchMediaPath({
    branch,
    availableMediaPaths,
    publicPath: enFrontmatter.coverImage,
    slug,
  })

  const { gallery: galleryWithFallback, warnings } = buildGalleryWithFallback({
    branch,
    availableMediaPaths,
    slug,
    coverRepoPath: coverImageRepoPath,
    frontmatterGallery: enFrontmatter.gallery,
  })

  const resolvedGallery = galleryWithFallback.map((item) => {
    const imageRepoPath = resolveBranchMediaPath({
      branch,
      availableMediaPaths,
      publicPath: item.image,
      slug,
    })
    return {
      caption: item.caption ?? null,
      image: item.image ?? null,
      imageRepoPath,
    }
  })

  const unresolvedGalleryItems = resolvedGallery
    .filter((item) => item.image && !item.imageRepoPath)
    .map((item) => item.image)

  const enDescriptionMarkdown = gitPathExists(branch, enDescriptionPath)
    ? readBranchText(branch, enDescriptionPath).trim()
    : ''
  const svDescriptionMarkdown =
    svFrontmatter && gitPathExists(branch, svDescriptionPath) ? readBranchText(branch, svDescriptionPath).trim() : ''

  const source = {
    slug,
    warnings: [
      ...warnings,
      ...(coverImageRepoPath ? [] : enFrontmatter.coverImage ? ['Cover image path could not be resolved.'] : []),
      ...unresolvedGalleryItems.map((item) => `Gallery image path could not be resolved: ${item}`),
    ],
    shared: {
      coverImagePublicPath: enFrontmatter.coverImage || null,
      coverImageRepoPath,
      client: enFrontmatter.client || null,
      location: enFrontmatter.location || null,
      year: enFrontmatter.year ?? null,
      projectStatus: enFrontmatter.projectStatus || null,
      services: ensureArray(enFrontmatter.services),
      collaborators: ensureArray(enFrontmatter.collaborators),
      featured: Boolean(enFrontmatter.featured),
      relatedProjects: ensureArray(enFrontmatter.relatedProjects),
      gallery: resolvedGallery,
      publishedAt: enFrontmatter.publishedAt || null,
    },
    en: {
      title: enFrontmatter.title || null,
      tagline: enFrontmatter.tagline || null,
      metaTitle: enFrontmatter.metaTitle || null,
      metaDescription: enFrontmatter.metaDescription || null,
      descriptionMarkdown: enDescriptionMarkdown,
      contentMarkdown: enBody,
      descriptionLexical: markdownToLexical(enDescriptionMarkdown),
      contentLexical: markdownToLexical(enBody),
    },
    sv: svFrontmatter
      ? {
          title: svFrontmatter.title || null,
          tagline: svFrontmatter.tagline || null,
          metaTitle: svFrontmatter.metaTitle || null,
          metaDescription: svFrontmatter.metaDescription || null,
          descriptionMarkdown: svDescriptionMarkdown,
          contentMarkdown: svBody,
          descriptionLexical: markdownToLexical(svDescriptionMarkdown),
          contentLexical: markdownToLexical(svBody),
        }
      : null,
  }

  return source
}

function buildEnglishPayload(source, mediaIdsByRepoPath, relatedProjectIds = []) {
  return {
    title: source.en.title,
    slug: source.slug,
    tagline: source.en.tagline,
    description: source.en.descriptionLexical,
    content: source.en.contentLexical,
    coverImage: source.shared.coverImageRepoPath ? mediaIdsByRepoPath.get(source.shared.coverImageRepoPath) : null,
    client: source.shared.client,
    location: source.shared.location,
    year: source.shared.year,
    projectStatus: source.shared.projectStatus,
    services: source.shared.services,
    collaborators: source.shared.collaborators,
    featured: source.shared.featured,
    relatedProjects: relatedProjectIds,
    gallery: source.shared.gallery
      .filter((item) => item.imageRepoPath && mediaIdsByRepoPath.has(item.imageRepoPath))
      .map((item) => ({
        image: mediaIdsByRepoPath.get(item.imageRepoPath),
        caption: item.caption,
      })),
    meta: {
      title: source.en.metaTitle,
      description: source.en.metaDescription,
    },
    publishedAt: source.shared.publishedAt,
    _status: 'published',
  }
}

function buildSwedishPayload(source) {
  if (!source.sv) return null
  return {
    title: source.sv.title,
    tagline: source.sv.tagline,
    description: source.sv.descriptionLexical,
    content: source.sv.contentLexical,
    meta: {
      title: source.sv.metaTitle,
      description: source.sv.metaDescription,
    },
  }
}

function printSummary(report) {
  console.log('\nImport Summary')
  console.log('--------------')
  console.log(`Source projects: ${report.sourceCount}`)
  console.log(`Exact matches:   ${report.summary.match}`)
  console.log(`To create:       ${report.summary.create}`)
  console.log(`To update:       ${report.summary.update}`)
  console.log(`Conflicts:       ${report.summary.conflict}`)
  console.log(`Review:          ${report.summary.review}`)
  console.log(`Keep live:       ${report.summary.keepLive}`)
  console.log(`Errors:          ${report.summary.error}`)

  const grouped = ['create', 'update', 'conflict', 'review', 'keep-live', 'error']
  for (const status of grouped) {
    const rows = report.projects.filter((project) => project.status === status)
    if (rows.length === 0) continue
    console.log(`\n${status.toUpperCase()}`)
    for (const row of rows) {
      console.log(`- ${row.slug}`)
      if (row.message) console.log(`  ${row.message}`)
      if (row.warnings?.length) {
        for (const warning of row.warnings) console.log(`  warning: ${warning}`)
      }
      if (row.potentialDuplicates?.length) {
        for (const duplicate of row.potentialDuplicates) {
          console.log(`  possible duplicate: ${duplicate.slug} (${duplicate.title}) similarity=${duplicate.similarity}`)
        }
      }
      if (row.differences?.length) {
        for (const difference of row.differences.slice(0, 8)) {
          console.log(`  diff: ${difference.field}`)
        }
        if (row.differences.length > 8) {
          console.log(`  ... ${row.differences.length - 8} more diff(s)`)
        }
      }
    }
  }
}

function loadDecisions(decisionsFile) {
  if (!decisionsFile) return {}
  const resolvedPath = path.resolve(decisionsFile)
  const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Decisions file must be a JSON object keyed by source slug.')
  }
  return parsed
}

function normalizeDecision(rawDecision) {
  if (!rawDecision) return null
  if (typeof rawDecision === 'string') {
    return { action: rawDecision, liveSlug: null }
  }
  if (typeof rawDecision === 'object' && !Array.isArray(rawDecision)) {
    return {
      action: rawDecision.action || '',
      liveSlug: rawDecision.liveSlug || null,
    }
  }
  return null
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  const projectFiles = listBranchPaths(options.branch, 'src/content/projects').filter((filePath) =>
    filePath.endsWith('/en.mdx'),
  )
  const discoveredSlugs = projectFiles
    .map((filePath) => filePath.replace(/^src\/content\/projects\//, '').replace(/\/en\.mdx$/, ''))
    .sort()

  const selectedSlugs =
    options.slugs.length > 0 ? discoveredSlugs.filter((slug) => options.slugs.includes(slug)) : discoveredSlugs

  if (selectedSlugs.length === 0) {
    console.error('No source projects matched the requested slug filter.')
    process.exit(1)
  }

  console.log(`Source branch: ${options.branch}`)
  console.log(`Mode: ${options.apply ? 'apply' : 'dry-run'}`)
  console.log(`Projects selected: ${selectedSlugs.length}`)

  const availableMediaPaths = new Set(listBranchPaths(options.branch, 'public/media'))
  const sourceProjects = selectedSlugs.map((slug) =>
    buildSourceProject({
      branch: options.branch,
      availableMediaPaths,
      slug,
    }),
  )

  const token = await login({
    url: options.url,
    email: options.email,
    password: options.password,
  })

  const [liveEnProjects, liveSvProjects] = await Promise.all([
    fetchPaginatedCollection({ url: options.url, token, collection: 'projects', locale: 'en' }),
    fetchPaginatedCollection({ url: options.url, token, collection: 'projects', locale: 'sv' }),
  ])

  const liveEnBySlug = new Map(liveEnProjects.map((doc) => [doc.slug, doc]))
  const liveSvBySlug = new Map(liveSvProjects.map((doc) => [doc.slug, doc]))

  const report = {
    sourceCount: sourceProjects.length,
    summary: {
      match: 0,
      create: 0,
      update: 0,
      conflict: 0,
      review: 0,
      keepLive: 0,
      error: 0,
    },
    projects: [],
  }

  const mediaCache = new Map()
  const decisions = loadDecisions(options.decisionsFile)

  for (const sourceProject of sourceProjects) {
    const row = {
      slug: sourceProject.slug,
      status: 'match',
      warnings: sourceProject.warnings,
      differences: [],
      potentialDuplicates: [],
      message: '',
      decision: normalizeDecision(decisions[sourceProject.slug]),
    }

    try {
      const normalizedSource = normalizeSourceProject(sourceProject)
      const targetLiveSlug = row.decision?.liveSlug || sourceProject.slug
      const liveEnDoc = liveEnBySlug.get(targetLiveSlug) || null
      const liveSvDoc = liveSvBySlug.get(targetLiveSlug) || null
      const liveMatch = liveEnDoc ? normalizeLiveProject(liveEnDoc) : null
      const liveSvMatch = liveSvDoc ? normalizeLiveProject(liveSvDoc) : null

      if (!liveEnDoc) {
        if (row.decision?.liveSlug) {
          row.status = 'error'
          row.message = `Decision references live slug "${row.decision.liveSlug}" but no such live project was found.`
          report.summary.error += 1
        } else if (row.decision?.action === 'live') {
          row.status = 'error'
          row.message = 'Decision says to keep live content, but there is no matching live project for this source slug.'
          report.summary.error += 1
        } else {
          const duplicates = findPotentialDuplicates(sourceProject, liveEnBySlug)
          if (duplicates.length > 0 && row.decision?.action !== 'create' && row.decision?.action !== 'source') {
            row.status = 'review'
            row.potentialDuplicates = duplicates
            row.message = 'No exact live slug match, but a similar live project title exists.'
            report.summary.review += 1
          } else {
            row.status = 'create'
            row.message =
              row.decision?.action === 'create'
                ? 'Confirmed to create despite duplicate review.'
                : row.decision?.action === 'source'
                  ? 'Confirmed to create from the keystatic source.'
                  : 'Project does not exist on the live site.'
            report.summary.create += 1
          }
        }
      } else {
        const sharedDiffs = diffObjects(normalizedSource.shared, liveMatch.shared, 'shared')
        const enDiffs = diffObjects(normalizedSource.en, liveMatch.locale, 'en')
        const svDiffs = normalizedSource.sv
          ? diffObjects(normalizedSource.sv, liveSvMatch?.locale ?? {}, 'sv')
          : liveSvMatch
            ? diffObjects({}, liveSvMatch.locale, 'sv')
            : []

        row.differences = [...sharedDiffs, ...enDiffs, ...svDiffs]

        if (row.differences.length > 0) {
          if (row.decision?.action === 'source') {
            row.status = 'update'
            row.message = `Confirmed to overwrite live project "${targetLiveSlug}" with the keystatic source.`
            report.summary.update += 1
          } else if (row.decision?.action === 'live') {
            row.status = 'keep-live'
            row.message = `Conflict acknowledged; keeping the live project "${targetLiveSlug}".`
            report.summary.keepLive += 1
          } else {
            row.status = 'conflict'
            row.message = 'Live project exists and differs from the keystatic source.'
            report.summary.conflict += 1
          }
        } else {
          row.status = 'match'
          row.message = 'Live project already matches the keystatic source.'
          report.summary.match += 1
        }
      }

      if (options.apply && (row.status === 'create' || row.status === 'update')) {
        const mediaIdsByRepoPath = new Map()
        const mediaPaths = [
          sourceProject.shared.coverImageRepoPath,
          ...sourceProject.shared.gallery.map((item) => item.imageRepoPath),
        ].filter(Boolean)

        for (const repoPath of mediaPaths) {
          const mediaDoc = await ensureMediaDocument({
            url: options.url,
            token,
            branch: options.branch,
            mediaCache,
            repoPath,
          })
          if (mediaDoc) mediaIdsByRepoPath.set(repoPath, mediaDoc.id)
        }

        const englishPayload = buildEnglishPayload(sourceProject, mediaIdsByRepoPath, [])
        let projectDoc = null

        if (row.status === 'create') {
          projectDoc = await createProject({
            url: options.url,
            token,
            locale: 'en',
            payload: englishPayload,
          })
          row.message = `Created live project id ${projectDoc.id}.`
        } else {
          projectDoc = await patchProject({
            url: options.url,
            token,
            id: liveEnDoc.id,
            locale: 'en',
            payload: englishPayload,
          })
          row.message = `Updated live project id ${projectDoc.id}.`
        }

        const swedishPayload = buildSwedishPayload(sourceProject)
        if (swedishPayload) {
          await patchProject({
            url: options.url,
            token,
            id: projectDoc.id,
            locale: 'sv',
            payload: swedishPayload,
          })
        }
      }
    } catch (error) {
      row.status = 'error'
      row.message = error instanceof Error ? error.message : String(error)
      report.summary.error += 1
    }

    report.projects.push(row)
  }

  printSummary(report)

  if (options.reportFile) {
    const reportPath = path.resolve(options.reportFile)
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    console.log(`\nWrote report: ${reportPath}`)
  }

  if (!options.apply) {
    console.log('\nDry run completed. No live writes were made.')
  } else {
    console.log('\nApply mode completed. Existing conflicts were left untouched for review.')
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error)
  process.exit(1)
})
