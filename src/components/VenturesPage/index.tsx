import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { VentureStageStrip } from '@/components/VentureStageStrip'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { Link } from '@/i18n/navigation'
import { getVentureDraft } from '@/lib/venture-drafts'
import { mediaUrl } from '@/lib/payload-queries'
import { normalizeVentureStatus } from '@/lib/venture-status'
import type { Venture } from '@/payload-types'
import { getTranslations } from 'next-intl/server'
import React from 'react'

const THEMES: VentureCardTheme[] = ['lime', 'lavender', 'ink']

interface Props {
  ventures: Venture[]
  locale: 'en' | 'sv'
}

export async function VenturesPage({ ventures, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'venturesPage' })
  const statusLabels: Record<string, string> = {
    seed: t('status.seed'),
    root: t('status.root'),
    sprout: t('status.sprout'),
    grow: t('status.grow'),
    flourish: t('status.flourish'),
  }

  const stages = [
    { key: 'seed' as const, name: t('stageModel.stages.seed.name'), description: t('stageModel.stages.seed.description') },
    { key: 'root' as const, name: t('stageModel.stages.root.name'), description: t('stageModel.stages.root.description') },
    { key: 'sprout' as const, name: t('stageModel.stages.sprout.name'), description: t('stageModel.stages.sprout.description') },
    { key: 'grow' as const, name: t('stageModel.stages.grow.name'), description: t('stageModel.stages.grow.description') },
    { key: 'flourish' as const, name: t('stageModel.stages.flourish.name'), description: t('stageModel.stages.flourish.description') },
  ]

  return (
    <main>
      <PageHeader
        tag={t('header.tag')}
        heading={t('header.heading')}
        body={t('header.body')}
      />

      {/* Manifesto */}
      <section className="py-28 md:py-40 bg-background border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <AnimateOnScroll>
              <Tag className="mb-5">{t('manifesto.tag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <SectionHeading as="h2" size="lg" className="mb-8">
                {t('manifesto.heading')}
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>{t('manifesto.body1')}</p>
                <p>{t('manifesto.body2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Stage model */}
      <section className="py-28 md:py-40 bg-ink">
        <div className="container">
          <AnimateOnScroll>
            <SectionHeading as="h2" size="lg" className="text-off-white max-w-xl mb-4">
              {t('stageModel.heading')}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={60}>
            <p className="text-off-white/65 max-w-2xl text-lg leading-relaxed mb-16">
              {t('stageModel.intro')}
            </p>
          </AnimateOnScroll>

          <VentureStageStrip stages={stages} />
        </div>
      </section>

      {/* Ventures grid */}
      <section className="py-28 md:py-40 bg-background">
        <div className="container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {ventures.map((venture, i) => {
            const draft = getVentureDraft(venture.slug, locale)
            const normalizedStatus = normalizeVentureStatus(venture.ventureStatus)
            const statusLabel = normalizedStatus ? statusLabels[normalizedStatus] : null

            return (
              <AnimateOnScroll key={venture.slug} delay={i * 80}>
                <VentureCard
                  title={venture.title}
                  tagline={venture.tagline ?? ''}
                  slug={venture.slug}
                  location={venture.location}
                  status={statusLabel}
                  ctaLabel={t('learnMore')}
                  accentColor={venture.themeColor}
                  theme={draft?.theme ?? THEMES[i % THEMES.length]}
                  image={mediaUrl(venture.coverImage, 'large') ?? mediaUrl(venture.coverImage)}
                  className="h-full"
                />
              </AnimateOnScroll>
            )
          })}
        </div>
      </section>

      {/* Invest */}
      <section className="py-28 md:py-40 bg-lavender">
        <div className="container">
          <div className="max-w-2xl">
            <AnimateOnScroll>
              <SectionHeading as="h2" size="lg" className="text-ink mb-6">
                {t('invest.heading')}
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <p className="text-lg leading-relaxed text-ink/75 mb-10">
                {t('invest.body')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-ink text-off-white px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
              >
                {t('invest.cta')} →
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </main>
  )
}
