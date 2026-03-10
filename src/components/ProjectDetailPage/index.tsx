import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import RichText from '@/components/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { mediaUrl, serviceLabels } from '@/lib/payload-queries'
import type { Project } from '@/payload-types'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { Gallery } from './Gallery'

interface Props {
  project: Project
  prev: Project | null
  next: Project | null
  locale: 'en' | 'sv'
}

export async function ProjectDetailPage({ project, prev, next, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'projectDetail' })
  const tags = serviceLabels(project.services, locale)
  const coverUrl = mediaUrl(project.coverImage, 'xlarge')

  const galleryImages =
    project.gallery
      ?.map((g) => {
        const src = mediaUrl(g.image, 'large')
        const fullSrc = mediaUrl(g.image, 'xlarge')
        return src ? { src, fullSrc, caption: g.caption ?? undefined } : null
      })
      .filter((g): g is { src: string; fullSrc: string | undefined; caption: string | undefined } => g !== null) ?? []

  return (
    <main>
      <section className="relative min-h-[70vh] flex items-end bg-ink overflow-hidden">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

        <div className="container relative z-10 pb-16 pt-40">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Tag key={tag} className="text-lime">
                {tag}
              </Tag>
            ))}
          </div>
          <SectionHeading as="h1" size="xl" className="text-off-white max-w-3xl">
            {project.title}
          </SectionHeading>
          {project.tagline && (
            <p className="mt-4 text-lg text-off-white/70 max-w-xl leading-relaxed">
              {project.tagline}
            </p>
          )}
        </div>
      </section>

      <div className="bg-ink border-t border-off-white/10">
        <div className="container py-6 flex flex-wrap gap-x-10 gap-y-3">
          {project.year && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                {t('meta.year')}
              </span>
              <span className="text-sm text-off-white/80">{project.year}</span>
            </div>
          )}
          {project.location && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                {t('meta.location')}
              </span>
              <span className="text-sm text-off-white/80">{project.location}</span>
            </div>
          )}
          {project.client && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                {t('meta.client')}
              </span>
              <span className="text-sm text-off-white/80">{project.client}</span>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                {t('meta.services')}
              </span>
              <span className="text-sm text-off-white/80">{tags.join(' · ')}</span>
            </div>
          )}
        </div>
      </div>

      {(project.description || project.content) && (
        <section className="py-24 bg-background">
          <div className="container max-w-3xl space-y-8">
            {project.description && (
              <AnimateOnScroll>
                <RichText data={project.description} enableGutter={false} enableProse />
              </AnimateOnScroll>
            )}
            {project.content && (
              <AnimateOnScroll delay={80}>
                <RichText data={project.content} enableGutter={false} enableProse />
              </AnimateOnScroll>
            )}
          </div>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="pb-24 bg-background">
          <div className="container">
            <Gallery
              images={galleryImages}
              projectTitle={project.title}
              labels={{
                viewImage: t('gallery.viewImage'),
                close: t('gallery.close'),
                previousImage: t('gallery.previousImage'),
                nextImage: t('gallery.nextImage'),
                imageLabel: t('gallery.imageLabel'),
                of: t('gallery.of'),
              }}
            />
          </div>
        </section>
      )}

      <nav className="border-t border-border bg-background">
        <div className="container grid grid-cols-2">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="py-10 pr-8 group border-r border-border hover:bg-muted/30 transition-colors"
            >
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground block mb-2">
                ← {t('previous')}
              </span>
              <span className="font-display font-bold text-lg text-foreground group-hover:text-lime transition-colors leading-snug">
                {prev.title}
              </span>
              <div className="flex flex-wrap gap-1 mt-2">
                {serviceLabels(prev.services, locale)
                  .slice(0, 2)
                  .map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="py-10 pl-8 group text-right hover:bg-muted/30 transition-colors"
            >
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground block mb-2">
                {t('next')} →
              </span>
              <span className="font-display font-bold text-lg text-foreground group-hover:text-lime transition-colors leading-snug">
                {next.title}
              </span>
              <div className="flex flex-wrap gap-1 mt-2 justify-end">
                {serviceLabels(next.services, locale)
                  .slice(0, 2)
                  .map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      <div className="bg-background py-8 border-t border-border text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t('allProjects')}
        </Link>
      </div>
    </main>
  )
}
