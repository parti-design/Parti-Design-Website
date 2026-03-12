import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

interface Props {
  locale: 'en' | 'sv'
}

export async function StudioPage({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'studioPageContent' })

  const values = [
    { label: t('values.participatory.label'), body: t('values.participatory.body') },
    { label: t('values.holistic.label'), body: t('values.holistic.body') },
    { label: t('values.regenerative.label'), body: t('values.regenerative.body') },
    { label: t('values.open.label'), body: t('values.open.body') },
  ]

  const services = [
    { label: t('services.architecture.label'), body: t('services.architecture.body') },
    { label: t('services.digital.label'), body: t('services.digital.body') },
    { label: t('services.social.label'), body: t('services.social.body') },
  ]

  return (
    <main>
      <PageHeader
        tag={t('header.tag')}
        heading={t('header.heading')}
        body={t('header.body')}
      />

      <section className="py-24 bg-background">
        <div className="container grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading>{t('about.heading')}</SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={80}>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('about.body1a')} <em>parti</em> {t('about.body1b')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120}>
              <blockquote className="border-l-4 border-lime pl-6 py-2 my-4">
                <p className="font-sans text-2xl md:text-3xl italic text-foreground leading-snug">
                  &ldquo;{t('about.quote')}&rdquo;
                </p>
              </blockquote>
            </AnimateOnScroll>

            <AnimateOnScroll delay={160}>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('about.body2')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('about.body3')}
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={120} className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/team/karina-and-kasimir-parti-design-photo.jpg"
              alt={t('about.photoAlt')}
              className="w-full aspect-[3/4] object-cover object-top rounded-md"
            />
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-24 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{t('team.heading')}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
            <AnimateOnScroll delay={80}>
              <div className="space-y-3">
                <Tag>{t('team.role')}</Tag>
                <p className="font-display font-bold text-xl text-foreground">Kasimir Suter Winter</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('team.kasimir')}</p>
                <a
                  href="mailto:kasimir@parti.design"
                  className="text-sm font-semibold text-foreground hover:text-lime transition-colors"
                >
                  kasimir@parti.design
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={140}>
              <div className="space-y-3">
                <Tag>{t('team.role')}</Tag>
                <p className="font-display font-bold text-xl text-foreground">Karina Suter Winter</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('team.karina')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{t('valuesHeading')}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {values.map((value, i) => (
              <AnimateOnScroll key={value.label} delay={i * 80}>
                <div className="space-y-2 p-6 border border-border rounded-md hover:-translate-y-1 transition-transform duration-300">
                  <Tag className="text-lime">{value.label}</Tag>
                  <p className="text-base text-foreground font-medium leading-snug">{value.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/20 border-t border-ink/10">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{t('servicesHeading')}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
            {services.map((service, i) => (
              <AnimateOnScroll key={service.label} delay={i * 100} className="px-0 md:px-10 first:pl-0 last:pr-0 py-10 md:py-0">
                <Tag className="mb-4">{service.label}</Tag>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.body}</p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink">
        <div className="container text-center max-w-2xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-off-white mb-6">
              {t('cta.heading')}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80}>
            <p className="text-off-white/60 leading-relaxed mb-10">{t('cta.body')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={140}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-lime text-ink font-semibold hover:bg-lime/90 transition-colors"
            >
              {t('cta.button')}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
