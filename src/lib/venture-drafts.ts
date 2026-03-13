type Locale = 'en' | 'sv'

export interface VentureDraftImage {
  src: string
  caption?: Record<Locale, string>
}

export interface VentureDraftContent {
  whatItDoes: string[]
  story: string[]
  support: string[]
  quote?: string
}

interface VentureDraft {
  theme: 'lime' | 'lavender' | 'ink'
  coverImage?: string
  gallery?: VentureDraftImage[]
  externalUrl?: string
  content: Record<Locale, VentureDraftContent>
}

const VENTURE_DRAFTS: Record<string, VentureDraft> = {
  massvis: {
    theme: 'lavender',
    externalUrl: 'https://www.massvis.se',
    content: {
      en: {
        whatItDoes: [
          'Massvis is a local community finance and coordination platform built on top of Open Collective. It gives grassroots groups, associations, and emerging initiatives a practical way to raise money, manage shared budgets, and organise themselves without needing to build their own systems from scratch.',
        ],
        story: [
          'The venture grew directly out of Umea Together. Through that programme, Parti Design saw the same pattern repeated across local initiatives: good ideas were everywhere, but the infrastructure for running them was fragmented, fragile, and often too administrative for small community groups to handle.',
          'Massvis emerged as a way to make that infrastructure local, understandable, and mission-aligned. Instead of asking each initiative to invent its own finance and governance tools, the platform offers a shared base that supports collective action from the start.',
        ],
        support: [
          'Parti Design supports Massvis across product development, brand direction, project management, and day-to-day platform operations. That includes shaping the user experience, helping onboard initiatives, and turning community finance into something accessible rather than bureaucratic.',
          'Longer term, Massvis is also a strategic piece in Parti Design’s byggemenskap work: a platform that could support shared budgets, communications, and governance for community-led housing groups.',
        ],
        quote: 'A community platform is only useful if people can actually use it to organise together.',
      },
      sv: {
        whatItDoes: [
          'Massvis är en lokal plattform för gemensam finansiering och organisering, byggd ovanpå Open Collective. Den ger gräsrotsgrupper, föreningar och nya initiativ ett praktiskt sätt att samla in pengar, hantera gemensamma budgetar och organisera sig utan att behöva bygga egna system från grunden.',
        ],
        story: [
          'Initiativet växte direkt ur Umeå Together. Genom det programmet såg Parti Design samma mönster om och om igen: goda idéer fanns överallt, men infrastrukturen för att driva dem var splittrad, skör och ofta för administrativ för små gemenskapsdrivna grupper.',
          'Massvis uppstod som ett sätt att göra den infrastrukturen lokal, begriplig och värderingsdriven. I stället för att varje initiativ ska uppfinna sina egna verktyg för ekonomi och organisering erbjuder plattformen en gemensam grund för kollektiv handling.',
        ],
        support: [
          'Parti Design stödjer Massvis genom produktutveckling, varumärkesriktning, projektledning och löpande plattformsdrift. Det handlar både om att forma användarupplevelsen, hjälpa initiativ att komma igång och göra gemenskapsfinansiering mer tillgänglig än byråkratisk.',
          'På sikt är Massvis också en strategisk del av Parti Designs arbete med byggemenskap: en plattform som kan stödja gemensamma budgetar, kommunikation och organisering för bostadsgrupper som vill bygga tillsammans.',
        ],
        quote: 'En gemenskapsplattform fungerar bara om människor faktiskt kan använda den för att organisera sig tillsammans.',
      },
    },
  },
  'umea-kallbad': {
    theme: 'lime',
    externalUrl: 'https://www.umeakallbad.se',
    coverImage: '/images/ventures/umea-kallbad/DSC04947.jpg',
    gallery: [
      { src: '/images/ventures/umea-kallbad/DSC04916.jpg' },
      { src: '/images/ventures/umea-kallbad/DSC04899.jpg' },
      { src: '/images/ventures/umea-kallbad/DSC01937.jpg' },
      { src: '/images/ventures/umea-kallbad/DSC_0247-Sofia.JPG' },
      { src: '/images/ventures/umea-kallbad/DSC09838-by Kasimir Suter Winter.jpg' },
    ],
    content: {
      en: {
        whatItDoes: [
          'Umea Kallbad is a community-led cold water bathing and sauna initiative. It creates a shared public place around winter swimming, heat, ritual, and social life by combining architectural design with hands-on co-building.',
        ],
        story: [
          'Umea had talked about a public cold bathing facility for years, but no public budget had materialised. Instead of waiting for the perfect brief, Parti Design treated the idea as a venture: gathering local residents, applying for grants, and building momentum through participation.',
          'The sauna and changing room were shaped collaboratively. Layout, material decisions, and the overall character of the place were developed with the people who would actually use it. Construction then happened through co-building workshops over two seasons, turning the process itself into community infrastructure.',
        ],
        support: [
          'Parti Design’s role spans venture development, architectural design, grant strategy, facilitation, and co-building leadership. The studio does not only design the structure; it helps create the organisational and social conditions that make the project possible.',
          'Umea Kallbad is a strong example of the studio’s venture model: when a valuable civic idea has no obvious commissioner, Parti Design can still help bring it into existence and make it real with the community around it.',
        ],
        quote: 'The best architecture is the kind people build with their own hands.',
      },
      sv: {
        whatItDoes: [
          'Umeå Kallbad är ett gemenskapsdrivet initiativ för kallbad och bastu. Det skapar en delad offentlig plats kring vinterbad, värme, ritual och socialt liv genom att kombinera arkitektonisk design med praktiskt sambygge.',
        ],
        story: [
          'Umeå hade pratat om en offentlig kallbadsanläggning i flera år, men någon offentlig budget blev aldrig verklighet. I stället för att vänta på den perfekta briefen behandlade Parti Design idén som ett eget initiativ: samlade boende, sökte bidrag och byggde framdrift genom deltagande.',
          'Bastun och omklädningsrummet formades gemensamt. Planlösning, materialval och platsens karaktär utvecklades tillsammans med dem som faktiskt skulle använda den. Byggandet genomfördes sedan som sambyggnadsworkshops över två säsonger, vilket gjorde processen till en del av den sociala infrastrukturen.',
        ],
        support: [
          'Parti Designs roll omfattar initiativutveckling, arkitektonisk design, bidragsstrategi, facilitering och ledning av sambyggandet. Studion ritar inte bara byggnaden utan hjälper också till att skapa de organisatoriska och sociala förutsättningar som gör projektet möjligt.',
          'Umeå Kallbad är ett tydligt exempel på studions venturemodell: när en värdefull idé för staden saknar en självklar beställare kan Parti Design ändå hjälpa till att förverkliga den tillsammans med gemenskapen runt omkring.',
        ],
        quote: 'Den bästa arkitekturen är den som människor bygger med sina egna händer.',
      },
    },
  },
  'dit-egnahem': {
    theme: 'ink',
    coverImage: '/images/ventures/dit-egnahem/DSC02856.JPG',
    gallery: [
      { src: '/images/ventures/dit-egnahem/DSC03501.JPG' },
      { src: '/images/ventures/dit-egnahem/DSC02785.JPG' },
      { src: '/images/ventures/dit-egnahem/DSC03496.JPG' },
      { src: '/images/ventures/dit-egnahem/DSC03549.jpg' },
      { src: '/images/ventures/dit-egnahem/DSC02844.JPG' },
      { src: '/images/ventures/dit-egnahem/DSC02805.jpg' },
    ],
    content: {
      en: {
        whatItDoes: [
          'DIT Egnahem is a do-it-together self-build housing venture and the first WikiHouse project in Sweden. It adapts open-source building systems to Swedish climate, regulation, and community-led housing models.',
        ],
        story: [
          'WikiHouse offers a radically different way to build: CNC-cut timber parts that can be assembled by non-specialists without heavy machinery. DIT Egnahem takes that idea and tests what it means in a Swedish context, both technically and socially.',
          'The venture is not only about one building. It is a proof of concept for a new housing model, one where communities can shape, finance, and build high-quality homes together rather than depending entirely on conventional development pathways.',
        ],
        support: [
          'Parti Design supports DIT Egnahem through architectural design, system adaptation, prototyping, community-building strategy, and the broader translation of open-source construction into a workable Swedish model.',
          'This is also where the studio’s architecture, facilitation, digital systems, and venture thinking converge most clearly. DIT Egnahem is both a building experiment and a long-term platform for future byggemenskap work.',
        ],
        quote: 'What if the house came with instructions and the community could build it together?',
      },
      sv: {
        whatItDoes: [
          'DIT Egnahem är ett do-it-together-initiativ för självbyggda bostäder och det första WikiHouse-projektet i Sverige. Det anpassar open source-byggsystem till svenskt klimat, regelverk och gemenskapsdrivna bostadsmodeller.',
        ],
        story: [
          'WikiHouse erbjuder ett radikalt annorlunda sätt att bygga: CNC-skurna trädelar som kan monteras av icke-specialister utan tung utrustning. DIT Egnahem tar den idén och testar vad den betyder i en svensk kontext, både tekniskt och socialt.',
          'Initiativet handlar inte bara om en byggnad. Det är ett proof of concept för en ny bostadsmodell där gemenskaper kan forma, finansiera och bygga högkvalitativa hem tillsammans i stället för att vara helt beroende av konventionella utvecklingsprocesser.',
        ],
        support: [
          'Parti Design stödjer DIT Egnahem genom arkitektonisk design, systemanpassning, prototypande, strategi för gemenskapsbyggande och den bredare översättningen av open source-byggande till en fungerande svensk modell.',
          'Det är också här studions arkitektur, facilitering, digitala system och venturetänk möts tydligast. DIT Egnahem är både ett byggeksperiment och en långsiktig plattform för framtida arbete med byggemenskap.',
        ],
        quote: 'Tänk om huset kom med instruktioner och gemenskapen kunde bygga det tillsammans?',
      },
    },
  },
}

export function getVentureDraft(
  slug: string,
  locale: Locale,
): (VentureDraftContent & {
  theme: VentureDraft['theme']
  coverImage?: string
  gallery: Array<{ src: string; caption?: string }>
  externalUrl?: string
}) | null {
  const draft = VENTURE_DRAFTS[slug]

  if (!draft) return null

  return {
    ...draft.content[locale],
    theme: draft.theme,
    coverImage: draft.coverImage,
    externalUrl: draft.externalUrl,
    gallery:
      draft.gallery?.map((image) => ({
        src: image.src,
        caption: image.caption?.[locale],
      })) ?? [],
  }
}
