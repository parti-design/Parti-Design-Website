import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { ProjectCard, type ProjectCardProps } from '@/components/ProjectCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import React from 'react'

const ALL_TAGS = ['All', 'Architecture', 'Co-building', 'Digital', 'Facilitation']

interface Props {
  projects: ProjectCardProps[]
}

export function WorkPage({ projects }: Props) {
  return (
    <main>
      <PageHeader
        tag="Portfolio"
        heading="Work that builds places and communities."
        body="Projects across architecture, digital design, co-building, and community facilitation — often all at once."
      />

      <section className="py-24 bg-background">
        <div className="container">
          {/* Tag filter — static for now, client-side filtering can be added later */}
          <AnimateOnScroll className="mb-10 flex flex-wrap gap-2">
            {ALL_TAGS.map((t) => (
              <span
                key={t}
                className="px-4 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground first:bg-ink first:text-off-white first:border-ink cursor-pointer hover:border-ink hover:text-foreground transition-colors"
              >
                {t}
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

      {/* Closing CTA */}
      <section className="py-24 bg-muted/40 border-t border-border">
        <div className="container text-center max-w-xl mx-auto">
          <AnimateOnScroll>
            <Tag className="mb-4 mx-auto">Get involved</Tag>
            <p className="text-2xl font-display font-bold text-foreground mb-6 leading-snug">
              Have a project in mind?
            </p>
            <p className="text-muted-foreground mb-8">
              We work with municipalities, developers, community organisations, and individuals.
              Reach out &mdash; we&apos;d love to hear about your project.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold hover:bg-ink/90 transition-colors"
            >
              Start a conversation
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
