import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { ProjectCard, type ProjectCardProps } from '@/components/ProjectCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

interface Props {
  projects: ProjectCardProps[]
  locale: 'en' | 'sv'
}

export async function WorkPage({ projects, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'workPage' })
  const allTags = [
    t('filters.all'),
    t('filters.architecture'),
    t('filters.coBuilding'),
    t('filters.digital'),
    t('filters.facilitation'),
  ]

  return (
    <main>
      <PageHeader
        tag={t('header.tag')}
        heading={t('header.heading')}
        body={t('header.body')}
      />

      <section className="py-24 bg-background">
        <div className="container">
          <AnimateOnScroll className="mb-10 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground first:bg-ink first:text-off-white first:border-ink cursor-pointer hover:border-ink hover:text-foreground transition-colors"
              >
                {tag}
              </span>
            ))}
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <AnimateOnScroll key={project.slug} delay={i * 60}>
                <ProjectCard {...project} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/40 border-t border-border">
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
