import { ProjectCard, type ProjectCardProps } from '@/components/ProjectCard'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { getVentureDraft } from '@/lib/venture-drafts'
import { normalizeVentureStatus } from '@/lib/venture-status'
import type { Venture } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { AnimateOnScroll } from './AnimateOnScroll'
import { HeroSection } from './HeroSection'

// ─── Static data ─────────────────────────────────────────────────────────────

const VENTURE_THEMES: VentureCardTheme[] = ['lime', 'lavender', 'ink']

const CLIENT_LOGOS = [
  { name: 'Umeå Kommun',     src: '/assets/clients/Umea-kommun-logo-black.svg' },
  { name: 'Kajeka',          src: '/assets/clients/kajeka-logo-black.svg' },
  { name: 'SLU',             src: '/assets/clients/SLU-logo-black.svg' },
  { name: 'Umeå University', src: '/assets/clients/UMU-logo-black.svg' },
  { name: 'Campus X',        src: '/assets/clients/campus-x-logo-black.svg' },
  { name: 'Coompanion',      src: '/assets/clients/coompanion-logo-black.svg' },
  { name: 'Klondyke',        src: '/assets/clients/Klondyke Logo Small.svg' },
  { name: 'Mmcité',          src: '/assets/clients/mmcite-logo-black.svg' },
  { name: 'Umeå Kallbad',    src: '/assets/clients/umea-kallbad-logo-black.svg' },
]

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  projects: ProjectCardProps[]
  ventures: Venture[]
  locale: 'en' | 'sv'
}

export async function HomePage({ projects, ventures, locale }: Props) {
  const t = await getTranslations({ locale })
  const statusLabels: Record<string, string> = {
    seed: t('venturesPage.status.seed'),
    root: t('venturesPage.status.root'),
    sprout: t('venturesPage.status.sprout'),
    grow: t('venturesPage.status.grow'),
    flourish: t('venturesPage.status.flourish'),
  }

  const SERVICES = [
    {
      label: t('services.items.physical.label'),
      heading: t('services.items.physical.heading'),
      body: t('services.items.physical.body'),
      slug: t('services.items.physical.slug'),
    },
    {
      label: t('services.items.digital.label'),
      heading: t('services.items.digital.heading'),
      body: t('services.items.digital.body'),
      slug: t('services.items.digital.slug'),
    },
    {
      label: t('services.items.social.label'),
      heading: t('services.items.social.heading'),
      body: t('services.items.social.body'),
      slug: t('services.items.social.slug'),
    },
  ]

  const marqueeTerms = t.raw('marquee.terms') as string[]

  return (
    <main>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Marquee strip ────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-lime py-3" aria-hidden>
        <div
          className="flex w-max"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center shrink-0">
              {marqueeTerms.map((term) => (
                <React.Fragment key={term}>
                  <span className="px-5 text-ink font-semibold text-sm tracking-wide">{term}</span>
                  <span className="text-ink/30 text-sm">·</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── 2. Services ──────────────────────────────────────────────────── */}
      <section id="services" className="bg-secondary/20 border-t border-ink/10 py-28 md:py-40 lg:py-52">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading as="h2" size="lg">{t('services.sectionLabel')}</SectionHeading>
          </AnimateOnScroll>
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
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {service.body}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-lime transition-colors"
                  >
                    {t('services.learnMore')} <span aria-hidden>→</span>
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Clients carousel ───────────────────────────────────────────── */}
      <section className="py-16 bg-background overflow-hidden" aria-label="Trusted by">
        <div className="overflow-hidden" aria-hidden>
          <div
            className="flex items-center w-max"
            style={{ animation: 'marquee 25s linear infinite', willChange: 'transform' }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center shrink-0 gap-20 pr-20">
                {CLIENT_LOGOS.map((client) => (
                  <div key={client.name} className="w-40 h-14 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.src}
                      alt={client.name}
                      className="max-w-full max-h-full object-contain dark:invert"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Selected Work — full-bleed grid ───────────────────────────── */}
      <section id="work" className="pt-16 md:pt-24 lg:pt-32 pb-16 bg-background">
        <div className="container mb-12">
          <AnimateOnScroll>
            <SectionHeading>{t('work.sectionHeading')}</SectionHeading>
          </AnimateOnScroll>
        </div>

        {/* Grid breaks out of container intentionally */}
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:auto-rows-[320px] gap-2">
          {projects[0] && (
            <AnimateOnScroll className="col-span-2 row-span-2">
              <ProjectCard {...projects[0]} large />
            </AnimateOnScroll>
          )}
          {projects.slice(1).map((project, i) => (
            <AnimateOnScroll key={project.slug} delay={i * 80} className="col-span-1">
              <ProjectCard {...project} />
            </AnimateOnScroll>
          ))}
        </div>

        <div className="container mt-10">
          <AnimateOnScroll>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-lime transition-colors"
            >
              {t('work.seeAll')} <span aria-hidden>→</span>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 5. Byggemenskap — full-bleed image section ───────────────────── */}
      <section className="relative min-h-[400px] md:min-h-[600px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/byggemenskap/kotten-sauna-build-team.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Gradient overlay — white in light mode, ink in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/10 dark:from-ink/95 dark:via-ink/75 dark:to-ink/10" />

        <div className="relative z-10 container py-28 md:py-40 lg:py-52">
          <div className="max-w-lg">
            <AnimateOnScroll>
              <Tag className="mb-5 text-ink/50 dark:text-lime">{t('byggemenskap.tag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <SectionHeading size="xl" className="text-ink dark:text-off-white mb-6">
                {t('byggemenskap.heading')}
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <p className="text-lg text-ink/70 dark:text-off-white/70 leading-relaxed mb-10">
                {t('byggemenskap.body')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={180}>
              <Link
                href="/byggemenskap"
                className="inline-flex items-center px-8 py-4 rounded-md border-2 border-ink/50 text-ink font-semibold hover:bg-ink hover:text-off-white dark:border-off-white/50 dark:text-off-white dark:hover:bg-off-white dark:hover:text-ink transition-colors"
              >
                {t('byggemenskap.cta')}
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── 6. Ventures ──────────────────────────────────────────────────── */}
      <section id="ventures" className="py-28 md:py-40 lg:py-52 bg-background border-t border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: heading + teaser + link */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <AnimateOnScroll>
                <SectionHeading>{t('ventures.sectionHeading')}</SectionHeading>
              </AnimateOnScroll>
              <AnimateOnScroll delay={60}>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t('ventures.teaser')}
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={120}>
                <Link
                  href="/ventures"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-lime transition-colors"
                >
                  {t('ventures.seeAll')} <span aria-hidden>→</span>
                </Link>
              </AnimateOnScroll>
            </div>

            {/* Right: all cards stacked */}
            <div className="space-y-4">
              {ventures.map((venture, i) => {
                const draft = getVentureDraft(venture.slug, locale)
                const statusLabel = normalizeVentureStatus(venture.ventureStatus)
                  ? statusLabels[normalizeVentureStatus(venture.ventureStatus)!]
                  : null
                return (
                  <AnimateOnScroll key={venture.slug} delay={i * 80}>
                    <VentureCard
                      title={venture.title}
                      tagline={venture.tagline ?? ''}
                      slug={venture.slug}
                      location={venture.location}
                      status={statusLabel}
                      ctaLabel={t('ventureCard.learnMore')}
                      accentColor={venture.themeColor}
                      theme={draft?.theme ?? VENTURE_THEMES[i % VENTURE_THEMES.length]}
                      image={typeof venture.coverImage === 'object' && venture.coverImage?.url ? venture.coverImage.url : undefined}
                    />
                  </AnimateOnScroll>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Closing CTA — left-aligned ────────────────────────────────── */}
      <section className="py-28 md:py-40 lg:py-52 bg-muted">
        <div className="container grid lg:grid-cols-5 gap-16 items-center">
          {/* Left: CTA */}
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading size="xl" className="text-foreground">
                {t('closingCta.heading')}
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={80}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('closingCta.body')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={160}>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold hover:bg-ink/85 dark:bg-off-white dark:text-ink dark:hover:bg-off-white/90 transition-colors"
              >
                {t('closingCta.cta')}
              </Link>
            </AnimateOnScroll>
          </div>

          {/* Right: pull quote */}
          <AnimateOnScroll delay={200} className="lg:col-span-2 hidden lg:block">
            <p className="font-display text-4xl xl:text-5xl text-foreground/60 italic leading-tight">
              &ldquo;{t('studio.quote')}&rdquo;
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
