import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import type { Project } from '@/lib/projects'
import Link from 'next/link'
import React from 'react'

import { Gallery } from './Gallery'

interface Props {
  project: Project
  prev: Project | null
  next: Project | null
}

export function ProjectDetailPage({ project, prev, next }: Props) {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end bg-ink overflow-hidden">
        {project.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageSrc}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

        <div className="container relative z-10 pb-16 pt-40">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <Tag key={tag} className="text-lime">
                {tag}
              </Tag>
            ))}
          </div>
          <SectionHeading as="h1" size="xl" className="text-off-white max-w-3xl">
            {project.title}
          </SectionHeading>
          <p className="mt-4 text-lg text-off-white/70 max-w-xl leading-relaxed">
            {project.description}
          </p>
        </div>
      </section>

      {/* ── Project meta strip ── */}
      <div className="bg-ink border-t border-off-white/10">
        <div className="container py-6 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
              Year
            </span>
            <span className="text-sm text-off-white/80">{project.year}</span>
          </div>
          <div>
            <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
              Location
            </span>
            <span className="text-sm text-off-white/80">{project.location}</span>
          </div>
          {project.client && (
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
                Client
              </span>
              <span className="text-sm text-off-white/80">{project.client}</span>
            </div>
          )}
          <div>
            <span className="text-xs font-semibold tracking-[0.08em] uppercase text-off-white/40 block mb-0.5">
              Services
            </span>
            <span className="text-sm text-off-white/80">{project.tags.join(' · ')}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <section className="py-24 bg-background">
        <div className="container grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 space-y-6">
            {project.body.map((para, i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <p className="text-base text-muted-foreground leading-relaxed">{para}</p>
              </AnimateOnScroll>
            ))}
          </div>

          {project.pullQuote && (
            <AnimateOnScroll delay={100} className="lg:col-span-2 lg:pt-2">
              <blockquote className="border-l-4 border-lime pl-6 py-2 sticky top-32">
                <p className="font-sans text-xl italic text-foreground leading-snug">
                  &ldquo;{project.pullQuote}&rdquo;
                </p>
              </blockquote>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* ── Gallery ── */}
      {project.gallery.length > 0 && (
        <section className="pb-24 bg-background">
          <div className="container">
            <Gallery images={project.gallery} projectTitle={project.title} />
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
                {prev.tags.slice(0, 2).map((t) => (
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
                {next.tags.slice(0, 2).map((t) => (
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
