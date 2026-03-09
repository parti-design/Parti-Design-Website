import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import RichText from '@/components/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { mediaUrl, serviceLabels } from '@/lib/payload-queries'
import type { Project } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

import { Gallery } from './Gallery'

interface Props {
  project: Project
  prev: Project | null
  next: Project | null
}

export function ProjectDetailPage({ project, prev, next }: Props) {
  const tags = serviceLabels(project.services)
  const coverUrl = mediaUrl(project.coverImage)

  const galleryImages =
    project.gallery
      ?.map((g) => {
        const url = mediaUrl(g.image)
        return url ? { src: url, caption: g.caption ?? undefined } : null
      })
      .filter((g): g is { src: string; caption: string | undefined } => g !== null) ?? []

  return (
    <main>
      {/* ── Hero ── */}
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

      {/* ── Project meta strip ── */}
      <div className="bg-ink border-t border-off-white/10">
        <div className="container py-6 flex flex-wrap gap-x-10 gap-y-3">
          {project.year && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                Year
              </span>
              <span className="text-sm text-off-white/80">{project.year}</span>
            </div>
          )}
          {project.location && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                Location
              </span>
              <span className="text-sm text-off-white/80">{project.location}</span>
            </div>
          )}
          {project.client && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                Client
              </span>
              <span className="text-sm text-off-white/80">{project.client}</span>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                Services
              </span>
              <span className="text-sm text-off-white/80">{tags.join(' · ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
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

      {/* ── Gallery ── */}
      {galleryImages.length > 0 && (
        <section className="pb-24 bg-background">
          <div className="container">
            <Gallery images={galleryImages} projectTitle={project.title} />
          </div>
        </section>
      )}

      {/* ── Prev / Next navigation ── */}
      <nav className="border-t border-border bg-background">
        <div className="container grid grid-cols-2">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="py-10 pr-8 group border-r border-border hover:bg-muted/30 transition-colors"
            >
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground block mb-2">
                ← Previous
              </span>
              <span className="font-display font-bold text-lg text-foreground group-hover:text-lime transition-colors leading-snug">
                {prev.title}
              </span>
              <div className="flex flex-wrap gap-1 mt-2">
                {serviceLabels(prev.services)
                  .slice(0, 2)
                  .map((t) => (
                    <Tag key={t}>{t}</Tag>
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
                Next →
              </span>
              <span className="font-display font-bold text-lg text-foreground group-hover:text-lime transition-colors leading-snug">
                {next.title}
              </span>
              <div className="flex flex-wrap gap-1 mt-2 justify-end">
                {serviceLabels(next.services)
                  .slice(0, 2)
                  .map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* ── Back to all work ── */}
      <div className="bg-background py-8 border-t border-border text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          ← All projects
        </Link>
      </div>
    </main>
  )
}
