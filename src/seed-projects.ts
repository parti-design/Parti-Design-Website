/**
 * Seed script — populates Projects and Ventures in Payload CMS with the
 * content from the old static projects.ts file.
 *
 * Run once locally after setting DATABASE_URL:
 *   DATABASE_URL=postgresql://... pnpm tsx src/seed-projects.ts
 *
 * Images are NOT seeded — upload them via the admin panel at /admin,
 * then link them to each project/venture record.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

// ─── Lexical helpers ──────────────────────────────────────────────────────────

function paragraph(text: string) {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', version: 1, text }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  }
}

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      children: paragraphs.map(paragraph),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
    },
  }
}

// ─── Service tag mapping ──────────────────────────────────────────────────────

type ServiceValue =
  | 'architecture-spatial'
  | 'graphic-design-branding'
  | 'ux-ui-digital'
  | 'co-design-workshops'
  | 'facilitation-project-management'
  | 'placemaking-consulting'
  | 'research-development'

const TAG_TO_SERVICE: Record<string, ServiceValue> = {
  'Architecture': 'architecture-spatial',
  'Co-building': 'co-design-workshops',
  'Workshop Facilitation': 'facilitation-project-management',
  'Facilitation': 'facilitation-project-management',
  'Co-design': 'co-design-workshops',
  'Web Development': 'ux-ui-digital',
  'Branding': 'graphic-design-branding',
  'Open Source': 'research-development',
  'Housing': 'architecture-spatial',
  'Exhibition': 'research-development',
  'Construction': 'architecture-spatial',
  'Community Build': 'co-design-workshops',
  'Circular': 'research-development',
  'Self-build Housing': 'architecture-spatial',
  'Placemaking': 'placemaking-consulting',
}

function mapServices(tags: string[]): ServiceValue[] {
  return [...new Set(tags.map((t) => TAG_TO_SERVICE[t]).filter((s): s is ServiceValue => !!s))]
}

// ─── Project data ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: 'Umeå Kallbad',
    slug: 'umea-kallbad',
    tags: ['Co-building', 'Workshop Facilitation', 'Architecture'],
    year: 2022,
    location: 'Umeå, Sweden',
    tagline: 'A community-led cold water bathing and sauna facility, co-designed and co-built with local residents.',
    body: [
      'Umeå had been talking about a public bathing facility for years — and no public budget had materialised. Rather than waiting, Parti Design took it on as a community venture: forming a group of residents, applying for grants, and running the design and construction as a series of co-building workshops.',
      'The sauna and changing room were designed collaboratively. Participants made decisions about layout, materials, and character. The structure was then built over two seasons of weekend workshops, with community members handling the construction under Parti Design\'s guidance.',
      'The facility opened in 2024 and is now a gathering point for cold water swimming throughout the year — from midsummer dips to midwinter ice bathing. It\'s become one of Umeå\'s most loved new additions.',
    ],
    featured: true,
    projectStatus: 'completed' as const,
  },
  {
    title: 'DIT Egnahem',
    slug: 'dit-egnahem',
    tags: ['Architecture', 'Self-build Housing', 'Open Source'],
    year: 2023,
    location: 'Umeå, Sweden',
    tagline: 'The first WikiHouse in Sweden — do-it-together self-build housing for communities.',
    body: [
      'WikiHouse is an open-source, CNC-cut timber building system — designed so that anyone can download the plans, cut the parts, and assemble a structurally sound building without specialist construction knowledge. DIT Egnahem adapted this system for Swedish climate, planning conditions, and the byggemenskap (community self-build) model.',
      'The structure was cut from standard sheet materials at a local CNC workshop and assembled on site in a weekend. The timber frame slots together like a giant puzzle — no nails, no heavy machinery, no expert labour required.',
      'The completed building demonstrates that high-quality, architecturally considered housing can be built by communities themselves, at a fraction of the cost of conventional construction. It is a proof of concept for a new model of housing in Sweden.',
    ],
    featured: true,
    projectStatus: 'completed' as const,
  },
  {
    title: 'Umeå Together',
    slug: 'umea-together',
    tags: ['Web Development', 'Branding', 'Facilitation'],
    year: 2023,
    location: 'Umeå, Sweden',
    client: 'Massvis / Umeå Municipality',
    tagline: 'A social incubator: workshops, branding, web development, and crowdfunding consulting for community-led initiatives.',
    body: [
      'Umeå Together was a learning community and incubator for local initiatives — bringing together grassroots groups, social enterprises, and community organisations to share knowledge, build skills, and raise funds.',
      'Parti Design contributed across the whole project: facilitating workshops, developing the brand identity, building the digital platform, and consulting on crowdfunding strategy. The cross-disciplinary nature of the commission is typical of how the studio works.',
      'The programme ran over six months and supported a dozen local initiatives — from community gardens to youth culture projects — each completing the programme with a clearer strategy, stronger identity, and a fundraising campaign.',
    ],
    featured: true,
    projectStatus: 'completed' as const,
  },
  {
    title: 'Rewilding Sweden — Dome',
    slug: 'rewilding-sweden-dome',
    tags: ['Architecture', 'Construction', 'Exhibition'],
    year: 2023,
    location: 'Sweden',
    client: 'Rewilding Sweden',
    tagline: 'A geodesic dome pavilion designed and built for Rewilding Sweden — structural geometry meets ecological storytelling.',
    body: [
      'Rewilding Sweden needed a temporary pavilion for their annual gathering — a space that could host talks, workshops, and exhibitions while communicating their ecological mission. Parti Design proposed a geodesic dome: structurally efficient, visually striking, and entirely demountable.',
      'The dome was designed to be assembled and disassembled by a small team without specialist tools. It was used as a central gathering and exhibition space, housing displays about rewilding ecology and hosting the event\'s programme.',
      'The project demonstrates how temporary architecture can be both high-quality and low-impact — built from standard components, leaving no trace when the event is over.',
    ],
    featured: false,
    projectStatus: 'completed' as const,
  },
  {
    title: 'Klondyke Farms',
    slug: 'klondyke-farms',
    tags: ['Branding', 'Web Development'],
    year: 2023,
    location: 'Sweden',
    client: 'Klondyke Farms',
    tagline: 'Brand identity and website for a local organic farm — clean, grounded, and commercially sharp.',
    body: [
      'Klondyke Farms is a small local farm with a growing direct-sales business. They needed a brand and digital presence that felt authentic to the farm\'s character — grounded and honest, without being rustic or nostalgic.',
      'Parti Design developed a visual identity rooted in the landscape and the physicality of the farm, and built a clean, fast website that supports their e-commerce and CSA (community-supported agriculture) offer.',
      'The project is an example of how the studio\'s digital work supports the same kind of local, community-rooted initiatives as its architecture and facilitation projects.',
    ],
    featured: false,
    projectStatus: 'completed' as const,
  },
  {
    title: 'Kajeka Student Housing',
    slug: 'kajeka',
    tags: ['Architecture', 'Co-design', 'Housing'],
    year: 2024,
    location: 'Umeå, Sweden',
    tagline: 'Participatory housing design for students — co-design workshops and architectural proposals for a new residential community.',
    body: [
      'Kajeka is a student housing co-design project in Umeå, exploring how new residential communities can be shaped by the people who will live in them. Parti Design led a series of workshops with students and housing stakeholders to develop a brief and design proposals.',
      'The process combined structured co-design methods with architectural development — moving from aspirations and values through to spatial concepts and built form. The goal was to produce both a housing proposal and a model of participatory development that could be replicated.',
    ],
    featured: false,
    projectStatus: 'in-progress' as const,
  },
  {
    title: 'Waste to Wonder',
    slug: 'waste-to-wonder',
    tags: ['Architecture', 'Community Build', 'Circular'],
    year: 2022,
    location: 'Umeå, Sweden',
    tagline: 'Transforming waste materials into community spaces — a hands-on construction project exploring circular building methods.',
    body: [
      'Waste to Wonder was an experimental community build project exploring what can be created from salvaged and waste materials. Working with a group of local participants, Parti Design facilitated a series of making sessions that produced a series of small structures and installations.',
      'The project was as much about process as outcome — demonstrating that meaningful architecture doesn\'t require new materials, large budgets, or specialist skills. It was also about building community through making.',
    ],
    featured: false,
    projectStatus: 'completed' as const,
  },
]

// ─── Venture data ─────────────────────────────────────────────────────────────

const VENTURES = [
  {
    title: 'Massvis',
    slug: 'massvis',
    tags: ['Web Development', 'Branding'],
    tagline: 'Community finance platform. Supporting local initiatives to raise funds and self-organise.',
    ventureStatus: 'active' as const,
    location: 'Umeå, Sweden',
    featured: true,
    order: 1,
  },
  {
    title: 'Umeå Kallbad',
    slug: 'umea-kallbad',
    tags: ['Co-building', 'Architecture'],
    tagline: 'A community-led cold water bathing and sauna facility for Umeå. Co-designed and co-built.',
    ventureStatus: 'completed' as const,
    location: 'Umeå, Sweden',
    featured: true,
    order: 2,
  },
  {
    title: 'DIT Egnahem',
    slug: 'dit-egnahem',
    tags: ['Architecture', 'Open Source'],
    tagline: 'The first WikiHouse in Sweden. Do-it-together self-build housing for communities.',
    ventureStatus: 'in-development' as const,
    location: 'Umeå, Sweden',
    featured: true,
    order: 3,
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

const databaseURL = process.env.DATABASE_URL
const allowRemoteDatabase = process.env.LOCAL_DEV_ALLOW_REMOTE_DATABASE === 'true'
const allowedHosts = new Set(['127.0.0.1', 'localhost', 'postgres'])

if (!databaseURL) {
  console.error('DATABASE_URL is required before seeding projects and ventures.')
  process.exit(1)
}

const parsedDatabaseURL = new URL(databaseURL)

if (!allowRemoteDatabase && !allowedHosts.has(parsedDatabaseURL.hostname)) {
  console.error(
    `Refusing to seed database host "${parsedDatabaseURL.hostname}". Set LOCAL_DEV_ALLOW_REMOTE_DATABASE=true only if this is intentional.`,
  )
  process.exit(1)
}

async function seed() {
  const payload = await getPayload({ config: configPromise })

  try {
    console.log('Ensuring projects exist...')
    for (const p of PROJECTS) {
      const existing = await payload.find({
        collection: 'projects',
        where: { slug: { equals: p.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`  skip (exists): ${p.title}`)
        continue
      }

      await payload.create({
        collection: 'projects',
        data: {
          title: p.title,
          slug: p.slug,
          tagline: p.tagline,
          content: richText(p.body),
          client: 'client' in p ? p.client : undefined,
          location: p.location,
          year: p.year,
          projectStatus: p.projectStatus,
          services: mapServices(p.tags),
          featured: p.featured,
          _status: 'published',
        },
      })
      console.log(`  created: ${p.title}`)
    }

    console.log('\nEnsuring ventures exist...')
    for (const v of VENTURES) {
      const existing = await payload.find({
        collection: 'ventures',
        where: { slug: { equals: v.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`  skip (exists): ${v.title}`)
        continue
      }

      await payload.create({
        collection: 'ventures',
        data: {
          title: v.title,
          slug: v.slug,
          tagline: v.tagline,
          ventureStatus: v.ventureStatus,
          location: v.location,
          services: mapServices(v.tags),
          featured: v.featured,
          order: v.order,
          _status: 'published',
        },
      })
      console.log(`  created: ${v.title}`)
    }

    console.log('\nDone! Layout seed data is present. Upload images in /admin if you want richer cards.')
  } finally {
    await payload.destroy()
  }
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
