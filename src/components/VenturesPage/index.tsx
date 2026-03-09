import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import React from 'react'

const VENTURES: {
  title: string
  tagline: string
  description: string
  slug: string
  theme: VentureCardTheme
  status: string
  tags: string[]
}[] = [
  {
    title: 'Massvis',
    tagline: 'Community finance platform.',
    description:
      'Massvis is a digital platform for community-led fundraising and self-organisation. It supports local initiatives to raise funds, coordinate members, and build momentum — from neighbourhood groups to housing cooperatives.',
    slug: 'massvis',
    theme: 'lime',
    status: 'Active',
    tags: ['Digital Platform', 'Community Finance', 'UX/UI'],
  },
  {
    title: 'Umeå Kallbad',
    tagline: 'Community cold bathing and sauna facility.',
    description:
      'A community-led cold water bathing and sauna facility built on the shores of Umeå. Co-designed and co-built with local residents over two seasons — the facility is now a beloved gathering place for year-round bathing.',
    slug: 'umea-kallbad',
    theme: 'lavender',
    status: 'Built',
    tags: ['Architecture', 'Co-building', 'Placemaking'],
  },
  {
    title: 'DIT Egnahem',
    tagline: 'Open-source self-build housing for communities.',
    description:
      'The first WikiHouse in Sweden. DIT (Do It Together) Egnahem adapts the open-source WikiHouse system for Swedish conditions — a modular, self-build housing typology designed for community land trusts and byggemenskap groups.',
    slug: 'dit-egnahem',
    theme: 'ink',
    status: 'Ongoing',
    tags: ['Architecture', 'Open Source', 'Byggemenskap'],
  },
]

export function VenturesPage() {
  return (
    <main>
      <PageHeader
        tag="Ventures"
        heading="We don't just respond to briefs — we initiate."
        body="Alongside client work, Parti Design incubates its own projects: initiatives we believe in and build ourselves."
      />

      {/* Venture listings */}
      <section className="py-24 bg-background">
        <div className="container space-y-24">
          {VENTURES.map((venture, i) => (
            <AnimateOnScroll key={venture.slug} delay={i * 80}>
              <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
                {/* Card */}
                <div className="lg:col-span-2">
                  <VentureCard
                    title={venture.title}
                    tagline={venture.tagline}
                    slug={venture.slug}
                    theme={venture.theme}
                  />
                </div>

                {/* Detail */}
                <div className="lg:col-span-3 space-y-5 pt-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block" />
                      {venture.status}
                    </span>
                    {venture.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {venture.description}
                  </p>

                  <Link
                    href={`/ventures/${venture.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-lime transition-colors"
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              {/* Divider */}
              {i < VENTURES.length - 1 && (
                <div className="mt-24 border-t border-border" />
              )}
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Venture studio model */}
      <section className="py-24 bg-ink">
        <div className="container grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading className="text-off-white">
                Why a venture studio?
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={80}>
              <p className="text-off-white/70 leading-relaxed">
                Client work keeps us sharp, but the things we believe in most — community finance,
                open-source housing, urban cold bathing — rarely arrive as a brief. So we make them
                ourselves.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={140}>
              <p className="text-off-white/70 leading-relaxed">
                Each venture is a real project that we invest our own time, design, and
                relationships into. Some grow into independent organisations; others fold back into
                the studio&apos;s service offer. All of them sharpen how we think.
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={100} className="lg:col-span-2 lg:pt-4">
            <blockquote className="border-l-4 border-lime pl-6 py-2">
              <p className="font-sans text-xl italic text-off-white leading-snug">
                &ldquo;The best projects we&apos;ve been part of started with a question, not a budget.&rdquo;
              </p>
            </blockquote>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
