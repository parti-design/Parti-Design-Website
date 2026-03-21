import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkPageClient, type FilterableProjectCard } from './Client'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

interface Props {
  projects: FilterableProjectCard[]
  locale: 'en' | 'sv'
}

export async function WorkPage({ projects, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'workPage' })
  const filterLabels = {
    all: t('filters.all'),
    architecture: t('filters.architecture'),
    coBuilding: t('filters.coBuilding'),
    digital: t('filters.digital'),
    facilitation: t('filters.facilitation'),
  }

  return (
    <main>
      <PageHeader
        tag={t('header.tag')}
        heading={t('header.heading')}
        body={t('header.body')}
      />

      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <WorkPageClient projects={projects} filterLabels={filterLabels} />
        </div>
      </section>

      <section className="py-20 md:py-32 lg:py-40 bg-ink">
        <div className="container text-center max-w-2xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-off-white mb-6">
              {t('cta.heading')}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-off-white/60 leading-relaxed mb-10">{t('cta.body')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
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
