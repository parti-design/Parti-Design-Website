import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { serviceLabels } from '@/lib/payload-queries'
import type { Venture } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

const THEMES: VentureCardTheme[] = ['lime', 'lavender', 'ink']

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  'in-development': 'In Development',
  completed: 'Completed',
}

interface Props {
  ventures: Venture[]
}

export function VenturesPage({ ventures }: Props) {
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
          {ventures.map((venture, i) => (
            <AnimateOnScroll key={venture.slug} delay={i * 80}>
              <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
                {/* Card */}
                <div className="lg:col-span-2">
                  <VentureCard
                    title={venture.title}
                    tagline={venture.tagline ?? ''}
                    slug={venture.slug}
                    theme={THEMES[i % THEMES.length]}
                  />
                </div>

                {/* Detail */}
                <div className="lg:col-span-3 space-y-5 pt-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {venture.ventureStatus && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block" />
                        {STATUS_LABELS[venture.ventureStatus] ?? venture.ventureStatus}
                      </span>
                    )}
                    {serviceLabels(venture.services).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>

                  {venture.tagline && (
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {venture.tagline}
                    </p>
                  )}

                  <Link
                    href={`/ventures/${venture.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-lime transition-colors"
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              {/* Divider */}
              {i < ventures.length - 1 && (
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
