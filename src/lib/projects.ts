export interface Project {
  title: string
  slug: string
  tags: string[]
  year: string
  location: string
  client?: string
  description: string
  /** Body copy — each string is a paragraph */
  body: string[]
  pullQuote?: string
  imageSrc?: string
  gallery: string[]
}

export const PROJECTS: Project[] = [
  {
    title: 'Kotten Changing Rooms',
    slug: 'umea-kallbad',
    tags: ['Co-building', 'Workshop Facilitation', 'Architecture'],
    year: '2022–2024',
    location: 'Umeå, Sweden',
    description:
      'A community-led cold water bathing and sauna facility, co-designed and co-built with local residents.',
    body: [
      'Umeå had been talking about a public bathing facility for years — and no public budget had materialised. Rather than waiting, Parti Design took it on as a community venture: forming a group of residents, applying for grants, and running the design and construction as a series of co-building workshops.',
      'The sauna and changing room were designed collaboratively. Participants made decisions about layout, materials, and character. The structure was then built over two seasons of weekend workshops, with community members handling the construction under Parti Design\'s guidance.',
      'The facility opened in 2024 and is now a gathering point for cold water swimming throughout the year — from midsummer dips to midwinter ice bathing. It\'s become one of Umeå\'s most loved new additions.',
    ],
    pullQuote: 'The best architecture is the kind people build with their own hands.',
    imageSrc: '/images/ventures/umea-kallbad/DSC04947.jpg',
    gallery: [
      '/images/ventures/umea-kallbad/DSC04916.jpg',
      '/images/ventures/umea-kallbad/DSC04899.jpg',
      '/images/ventures/umea-kallbad/DSC09791-by%20Sofia%20Mor%C3%A9n.jpg',
      '/images/ventures/umea-kallbad/DSC_3852.jpg',
      '/images/ventures/umea-kallbad/DSC09766-by%20Sofia%20Mor%C3%A9n.jpg',
      '/images/ventures/umea-kallbad/DSC09959-by%20Kasimir%20Suter%20Winter.jpg',
      '/images/ventures/umea-kallbad/DSC_3813.jpg',
      '/images/projects/umea-kallbad-changing-room-co-build/1-DSC05236.jpg',
    ],
  },
  {
    title: 'Naturest Cabin',
    slug: 'naturest-cabin',
    tags: ['Architecture', 'Self-build Housing', 'Open Source'],
    year: '2025',
    location: 'Umeå, Sweden',
    description:
      'An off-grid WikiHouse prototype — CNC-cut timber, community-assembled, and designed to perform like a passive house.',
    body: [
      'WikiHouse is an open-source, CNC-cut timber building system — designed so that anyone can download the plans, cut the parts, and assemble a structurally sound building without specialist construction knowledge. DIT Egnahem adapted this system for Swedish climate, planning conditions, and the byggemenskap (community self-build) model.',
      'The structure was cut from standard sheet materials at a local CNC workshop and assembled on site in a weekend. The timber frame slots together like a giant puzzle — no nails, no heavy machinery, no expert labour required.',
      'The completed building demonstrates that high-quality, architecturally considered housing can be built by communities themselves, at a fraction of the cost of conventional construction. It is a proof of concept for a new model of housing in Sweden.',
    ],
    pullQuote: 'What if the house came with instructions — and anyone could build it?',
    imageSrc: '/media/projects/naturest-cabin/dsc02856.jpg',
    gallery: [
      '/media/projects/naturest-cabin/dsc03501.jpg',
      '/media/projects/naturest-cabin/dsc02785.jpg',
      '/media/projects/naturest-cabin/dsc03496.jpg',
      '/media/projects/naturest-cabin/dsc03549.jpg',
      '/media/projects/naturest-cabin/dsc02844.jpg',
      '/media/projects/naturest-cabin/dsc02805.jpg',
    ],
  },
  {
    title: 'Umeå Together',
    slug: 'umea-together',
    tags: ['Web Development', 'Branding', 'Facilitation'],
    year: '2025',
    location: 'Umeå, Sweden',
    client: 'Massvis / Umeå Municipality',
    description:
      'A social incubator: workshops, branding, web development, and crowdfunding consulting for community-led initiatives.',
    body: [
      'Umeå Together was a learning community and incubator for local initiatives — bringing together grassroots groups, social enterprises, and community organisations to share knowledge, build skills, and raise funds.',
      'Parti Design contributed across the whole project: facilitating workshops, developing the brand identity, building the digital platform, and consulting on crowdfunding strategy. The cross-disciplinary nature of the commission is typical of how the studio works.',
      'The programme ran over six months and supported a dozen local initiatives — from community gardens to youth culture projects — each completing the programme with a clearer strategy, stronger identity, and a fundraising campaign.',
    ],
    imageSrc: '/images/projects/umea-together/DSC09594.jpg',
    gallery: [
      '/images/projects/umea-together/DSC09673.jpg',
      '/images/projects/umea-together/DSC09678.jpg',
      '/images/projects/umea-together/H15A1291.jpg',
    ],
  },
  {
    title: 'Rewilding Sweden — Dome',
    slug: 'rewilding-sweden-dome',
    tags: ['Architecture', 'Construction', 'Exhibition'],
    year: '2025',
    location: 'Sweden',
    client: 'Rewilding Sweden',
    description:
      'A geodesic dome pavilion designed and built for Rewilding Sweden — structural geometry meets ecological storytelling.',
    body: [
      'Rewilding Sweden needed a temporary pavilion for their annual gathering — a space that could host talks, workshops, and exhibitions while communicating their ecological mission. Parti Design proposed a geodesic dome: structurally efficient, visually striking, and entirely demountable.',
      'The dome was designed to be assembled and disassembled by a small team without specialist tools. It was used as a central gathering and exhibition space, housing displays about rewilding ecology and hosting the event\'s programme.',
      'The project demonstrates how temporary architecture can be both high-quality and low-impact — built from standard components, leaving no trace when the event is over.',
    ],
    imageSrc: '/images/projects/rewilding-sweden/Rewilding%20Pavilion%20Illustration.png',
    gallery: [],
  },
  {
    title: 'Klondyke Farms',
    slug: 'klondyke-farms',
    tags: ['Branding', 'Web Development'],
    year: '2025',
    location: 'Sweden',
    client: 'Klondyke Farms',
    description:
      'Brand identity and website for a local organic farm — clean, grounded, and commercially sharp.',
    body: [
      'Klondyke Farms is a small local farm with a growing direct-sales business. They needed a brand and digital presence that felt authentic to the farm\'s character — grounded and honest, without being rustic or nostalgic.',
      'Parti Design developed a visual identity rooted in the landscape and the physicality of the farm, and built a clean, fast website that supports their e-commerce and CSA (community-supported agriculture) offer.',
      'The project is an example of how the studio\'s digital work supports the same kind of local, community-rooted initiatives as its architecture and facilitation projects.',
    ],
    imageSrc: undefined,
    gallery: [],
  },
  {
    title: 'Kajeka Student Housing',
    slug: 'kajeka',
    tags: ['Architecture', 'Co-design', 'Housing'],
    year: '2024–2025',
    location: 'Umeå, Sweden',
    description:
      'Participatory housing design for students — co-design workshops and architectural proposals for a new residential community.',
    body: [
      'Kajeka is a student housing co-design project in Umeå, exploring how new residential communities can be shaped by the people who will live in them. Parti Design led a series of workshops with students and housing stakeholders to develop a brief and design proposals.',
      'The process combined structured co-design methods with architectural development — moving from aspirations and values through to spatial concepts and built form. The goal was to produce both a housing proposal and a model of participatory development that could be replicated.',
    ],
    imageSrc: undefined,
    gallery: [],
  },
  {
    title: 'Waste to Wonder',
    slug: 'waste-to-wonder-lab',
    tags: ['Architecture', 'Community Build', 'Circular'],
    year: '2022',
    location: 'Umeå, Sweden',
    description:
      'Transforming waste materials into community spaces — a hands-on construction project exploring circular building methods.',
    body: [
      'Waste to Wonder was an experimental community build project exploring what can be created from salvaged and waste materials. Working with a group of local participants, Parti Design facilitated a series of making sessions that produced a series of small structures and installations.',
      'The project was as much about process as outcome — demonstrating that meaningful architecture doesn\'t require new materials, large budgets, or specialist skills. It was also about building community through making.',
    ],
    imageSrc: '/images/projects/waste-to-wonder/DSC06551.jpg',
    gallery: [
      '/images/projects/waste-to-wonder/19D323C3-F5D8-4EC5-8146-E4C76EAE74DE.JPG',
      '/images/projects/waste-to-wonder/58826378-B0EE-4E4F-98E6-9BDA9F109F07.JPG',
      '/images/projects/waste-to-wonder/IMG_8643.JPG',
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getAdjacentProjects(
  slug: string,
): { prev: Project | null; next: Project | null } {
  const idx = PROJECTS.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? (PROJECTS[idx - 1] ?? null) : null,
    next: idx < PROJECTS.length - 1 ? (PROJECTS[idx + 1] ?? null) : null,
  }
}
