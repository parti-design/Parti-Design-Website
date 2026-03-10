/**
 * Ventures listing page component.
 * Updated to use keystatic-queries instead of payload-queries.
 */
import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { serviceLabels } from '@/lib/keystatic-queries'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

const THEMES: VentureCardTheme[] = ['lime', 'lavender', 'ink']

// Minimal venture shape expected from Keystatic queries
interface VentureShape {
  slug: string
  title: string | { value?: string } | unknown
  tagline?: string | null
  ventureStatus?: string | null
  services?: readonly string[] | string[] | null
}

interface Props {
  ventures: VentureShape[]
  locale: 'en' | 'sv'
}

export async function VenturesPage({ ventures, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'venturesPage' })

  const statusLabels: Record<string, string> = {
    active: t('status.active'),
    'in-development': t('status.inDevelopment'),
    completed: t('status.completed'),
  }

  return (
    <main>
      <PageHeader
        tag={t('header.tag')}
        heading={t('header.heading')}
        body={t('header.body')}
      />

      <section className="py-24 bg-background">
        <div className="container space-y-24">
          {ventures.map((venture, i) => {
            // Keystatic slug fields return { value: string }; handle both shapes
            const title = typeof venture.title === 'object' && venture.title !== null
              ? ((venture.title as { value?: string }).value ?? venture.slug)
              : (venture.title as string) ?? venture.slug

            return (
              <AnimateOnScroll key={venture.slug} delay={i * 80}>
                <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
                  <div className="lg:col-span-2">
                    <VentureCard
                      title={title}
                      tagline={venture.tagline ?? ''}
                      slug={venture.slug}
                      ctaLabel={t('learnMore')}
                      theme={THEMES[i % THEMES.length]}
                    />
                  </div>

                  <div className="lg:col-span-3 space-y-5 pt-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      {venture.ventureStatus && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block" />
                          {statusLabels[venture.ventureStatus] ?? venture.ventureStatus}
                        </span>
                      )}
                      {serviceLabels(venture.services, locale).map((tag) => (
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
                      {t('learnMore')} <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>

                {i < ventures.length - 1 && <div className="mt-24 border-t border-border" />}
              </AnimateOnScroll>
            )
          })}
        </div>
      </section>

      <section className="py-24 bg-ink">
        <div className="container grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading className="text-off-white">{t('why.heading')}</SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={80}>
              <p className="text-off-white/70 leading-relaxed">{t('why.body1')}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={140}>
              <p className="text-off-white/70 leading-relaxed">{t('why.body2')}</p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={100} className="lg:col-span-2 lg:pt-4">
            <blockquote className="border-l-4 border-lime pl-6 py-2">
              <p className="font-sans text-xl italic text-off-white leading-snug">
                &ldquo;{t('why.quote')}&rdquo;
              </p>
            </blockquote>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
