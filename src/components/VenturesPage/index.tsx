import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { getVentureDraft } from '@/lib/venture-drafts'
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

  return (
    <main>
      <PageHeader
        tag={t('header.tag')}
        heading={t('header.heading')}
        body={t('header.body')}
      />

      <section className="py-24 bg-background">
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
                  className="h-full"
                />
              </AnimateOnScroll>
            )
          })}
        </div>
      </section>
    </main>
  )
}
