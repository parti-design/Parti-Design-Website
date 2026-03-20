import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tag } from '@/components/ui/Tag'
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

      <section className="py-14 md:py-24 bg-background">
        <div className="container">
          <WorkPageClient projects={projects} filterLabels={filterLabels} />
        </div>
      </section>

      <section className="py-14 md:py-24 bg-muted/40 border-t border-border">
        <div className="container text-center max-w-xl mx-auto">
          <AnimateOnScroll>
            <Tag className="mb-4 mx-auto">{t('cta.tag')}</Tag>
            <p className="text-2xl font-display font-bold text-foreground mb-6 leading-snug">
              {t('cta.heading')}
            </p>
            <p className="text-muted-foreground mb-8">{t('cta.body')}</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold hover:bg-ink/90 transition-colors"
            >
              {t('cta.button')}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
