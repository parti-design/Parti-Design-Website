import { ProjectCard, type ProjectCardProps } from '@/components/ProjectCard'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { AnimateOnScroll } from './AnimateOnScroll'
import { HeroSection } from './HeroSection'
import type { HomepageContent } from '@/lib/keystatic-queries'

// ─── Static data ─────────────────────────────────────────────────────────────

const VENTURE_THEMES: VentureCardTheme[] = ['lime', 'lavender', 'ink']

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal venture shape used by the home page — matches what Keystatic returns */
interface VentureCard {
  slug: string
  title: string
  tagline: string
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  projects: ProjectCardProps[]
  ventures: VentureCard[]
  content: HomepageContent
}

export async function HomePage({ projects, ventures, content }: Props) {
  // `t` is only used for UI chrome strings not managed in the CMS
  const t = await getTranslations()

  const SERVICES = [
    {
      label: content.digitalLabel,
      heading: content.digitalHeading,
      body: content.digitalBody,
      examples: content.digitalExamples,
    },
    {
      label: content.physicalLabel,
      heading: content.physicalHeading,
      body: content.physicalBody,
      examples: content.physicalExamples,
    },
    {
      label: content.socialLabel,
      heading: content.socialHeading,
      body: content.socialBody,
      examples: content.socialExamples,
    },
  ]

  return (
    <main>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <HeroSection
        headline={content.heroHeadline}
        substatement={content.heroSubstatement}
        ctaWork={content.heroCta}
        ctaContact={content.heroCtaContact}
      />

      {/* ── Marquee strip ────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-lime py-3" aria-hidden>
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center shrink-0">
              {content.marqueeTerms.map((term) => (
                <React.Fragment key={term}>
                  <span className="px-5 text-ink font-semibold text-sm tracking-wide">{term}</span>
                  <span className="text-ink/30 text-sm">·</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── 2. What We Do ────────────────────────────────────────────────── */}
      <section id="services" className="bg-secondary/20 border-t border-ink/10 py-24">
        <div className="container">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
            {SERVICES.map((service, i) => (
              <AnimateOnScroll
                key={service.label}
                delay={i * 100}
                className="px-0 md:px-10 first:pl-0 last:pr-0 py-12 md:py-0"
              >
                <div className="hover:-translate-y-1 transition-transform duration-300 group">
                  <Tag className="mb-4 group-hover:text-lime transition-colors">
                    {service.label}
                  </Tag>
                  <SectionHeading as="h3" size="md" className="mb-3">
                    {service.heading}
                  </SectionHeading>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {service.body}
                  </p>
                  <p className="text-xs text-muted-foreground italic">{service.examples}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Selected Work ─────────────────────────────────────────────── */}
      <section id="work" className="py-24 bg-background">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{content.workSectionHeading}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 lg:auto-rows-[280px] gap-3">
            {/* Large card spans 2 columns × 2 rows */}
            {projects[0] && (
              <AnimateOnScroll className="col-span-2 row-span-2">
                <ProjectCard {...projects[0]} large />
              </AnimateOnScroll>
            )}

            {/* Remaining cards */}
            {projects.slice(1).map((project, i) => (
              <AnimateOnScroll key={project.slug} delay={i * 80} className="col-span-1">
                <ProjectCard {...project} />
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-10">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-lime transition-colors"
            >
              {t('work.seeAll')} <span aria-hidden>→</span>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 4. The Studio ────────────────────────────────────────────────── */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading>{content.studioHeading}</SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <p className="text-base text-muted-foreground leading-relaxed">
                {content.studioBody1}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={150}>
              <blockquote className="border-l-4 border-lime pl-6 py-2 my-2">
                <p className="font-sans text-2xl md:text-3xl italic text-foreground leading-snug">
                  &ldquo;{content.studioQuote}&rdquo;
                </p>
              </blockquote>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="text-base text-muted-foreground leading-relaxed">
                {content.studioBody2}
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={150} className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/team/karina-and-kasimir-parti-design-photo.jpg"
              alt={content.studioPhotoAlt}
              className="w-full aspect-[3/4] object-cover object-top"
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 5. Ventures ──────────────────────────────────────────────────── */}
      <section id="ventures" className="py-24 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-2">
            <p className="text-base text-foreground font-medium">
              {content.venturesTeaser}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80} className="mb-12">
            <p className="text-sm text-muted-foreground max-w-lg">
              {content.venturesBody}
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-4">
            {ventures.map((venture, i) => (
              <AnimateOnScroll key={venture.slug} delay={i * 100}>
                <VentureCard
                  title={venture.title}
                  tagline={venture.tagline ?? ''}
                  slug={venture.slug}
                  ctaLabel={t('ventureCard.learnMore')}
                  theme={VENTURE_THEMES[i % VENTURE_THEMES.length]}
                />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Byggemenskap callout ───────────────────────────────────────── */}
      <section className="py-24 bg-lime">
        <div className="container text-center max-w-3xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-ink mb-6">
              {content.byggemenskapHeading}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-ink/80 leading-relaxed mb-10">
              {content.byggemenskapBody}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md border-2 border-ink text-ink font-semibold hover:bg-ink hover:text-lime transition-colors"
            >
              {content.byggemenskapCta}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 7. Contact / Closing CTA ─────────────────────────────────────── */}
      <section className="py-32 bg-ink">
        <div className="container text-center max-w-2xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-off-white mb-6">
              {content.closingHeading}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-off-white/60 leading-relaxed mb-4">
              {content.closingBody}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={150}>
            <a
              href={`mailto:${content.contactEmail}`}
              className="block text-sm text-off-white/50 hover:text-lime transition-colors mb-10"
            >
              {content.contactEmail}
            </a>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-lime text-ink font-semibold hover:bg-lime/90 transition-colors"
            >
              {content.closingCta}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
