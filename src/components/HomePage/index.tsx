import { ProjectCard } from '@/components/ProjectCard'
import { VentureCard, type VentureCardTheme } from '@/components/VentureCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import React from 'react'

import { AnimateOnScroll } from './AnimateOnScroll'
import { HeroSection } from './HeroSection'

// ─── Static data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    label: 'Digital',
    heading: 'Tools for communities to grow',
    body: 'Websites, platforms, digital services, UX/UI design. Building the tools communities and organisations need to organise and grow.',
    examples: 'e.g. Massvis platform, Klondyke Farms website',
  },
  {
    label: 'Physical',
    heading: 'Spaces that people want to be in',
    body: 'Architecture, spatial design, co-building workshops. Designing and constructing spaces that people want to be in.',
    examples: 'e.g. DIT Egnahem, Rewilding Sweden pavilion',
  },
  {
    label: 'Social',
    heading: 'Bringing communities together',
    body: 'Co-design facilitation, workshops, placemaking consulting. Bringing people together to shape the places they live in.',
    examples: 'e.g. Umeå Together, Kajeka student housing',
  },
]

const PROJECTS = [
  {
    title: 'Umeå Kallbad',
    tags: ['Co-building', 'Workshop Facilitation'],
    description:
      'A community-led cold water bathing facility for Umeå. Co-designed and co-built with local residents.',
    slug: 'umea-kallbad',
    large: true,
  },
  {
    title: 'DIT Egnahem',
    tags: ['Architecture', 'Self-build Housing'],
    description: 'The first WikiHouse in Sweden — do-it-together self-build housing for communities.',
    slug: 'dit-egnahem',
  },
  {
    title: 'Umeå Together',
    tags: ['Web', 'Branding', 'Facilitation'],
    description: 'A social incubator: workshops, branding, web development, and crowdfunding consulting.',
    slug: 'umea-together',
  },
  {
    title: 'Rewilding Sweden — Dome',
    tags: ['Architecture', 'Construction'],
    description: 'A geodesic dome pavilion designed and built for Rewilding Sweden.',
    slug: 'rewilding-sweden-dome',
  },
  {
    title: 'Klondyke Farms',
    tags: ['Branding', 'Web Development'],
    description: 'Branding and website for a local farm — clean, grounded, commercial.',
    slug: 'klondyke-farms',
  },
]

const VENTURES: { title: string; tagline: string; slug: string; theme: VentureCardTheme }[] = [
  {
    title: 'Massvis',
    tagline: 'Community finance platform. Supporting local initiatives to raise funds and self-organise.',
    slug: 'massvis',
    theme: 'lime',
  },
  {
    title: 'Umeå Kallbad',
    tagline: 'A community-led cold bathing and sauna facility for Umeå. Co-designed and co-built.',
    slug: 'umea-kallbad',
    theme: 'lavender',
  },
  {
    title: 'DIT Egnahem',
    tagline: 'The first WikiHouse in Sweden. Do-it-together self-build housing for communities.',
    slug: 'dit-egnahem',
    theme: 'ink',
  },
]

// ─── Main component ───────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <main>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. What We Do ────────────────────────────────────────────────── */}
      <section id="services" className="bg-secondary/20 border-t border-ink/10 py-24">
        <div className="container">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
            {SERVICES.map((service, i) => (
              <AnimateOnScroll
                key={service.label}
                delay={i * 100}
                className="px-0 md:px-10 first:pl-0 last:pr-0 py-12 md:py-0"
              >
                <Tag className="mb-4">{service.label}</Tag>
                <SectionHeading as="h3" size="md" className="mb-3">
                  {service.heading}
                </SectionHeading>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.body}</p>
                <p className="text-xs text-muted-foreground italic">{service.examples}</p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Selected Work ─────────────────────────────────────────────── */}
      <section id="work" className="py-24 bg-background">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>Selected work</SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Large card spans 2 columns × 2 rows */}
            <AnimateOnScroll className="col-span-2 row-span-2">
              <ProjectCard {...PROJECTS[0]!} large />
            </AnimateOnScroll>

            {/* Remaining 4 cards */}
            {PROJECTS.slice(1).map((project, i) => (
              <AnimateOnScroll key={project.slug} delay={i * 80} className="col-span-1">
                <ProjectCard {...project} />
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-10">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-lime transition-colors"
            >
              See all projects <span aria-hidden>→</span>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 4. The Studio ────────────────────────────────────────────────── */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading>An architecture studio that builds differently.</SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <p className="text-base text-muted-foreground leading-relaxed">
                Founded in 2022 by Kasimir and Karina while still studying — as a vessel for their
                creative, research, and community interests. The name means three things:
                participatory design, the French concept diagram that drives an architectural idea,
                and a refusal to take architecture too seriously.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={150}>
              <blockquote className="border-l-4 border-lime pl-6 py-2 my-2">
                <p className="font-sans text-2xl md:text-3xl italic text-foreground leading-snug">
                  "Citizens are the experts of place."
                </p>
              </blockquote>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="text-base text-muted-foreground leading-relaxed">
                They work holistically — a single project might combine architecture, workshop
                facilitation, branding, and a website. The studio operates as both a practice and a
                venture studio, incubating its own initiatives alongside client work.
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={150} className="lg:col-span-2">
            {/* Photo placeholder — swap in Kasimir + Karina photo when ready */}
            <div className="aspect-[3/4] bg-secondary/30 flex items-center justify-center text-muted-foreground text-sm">
              Photo coming soon
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 5. Ventures ──────────────────────────────────────────────────── */}
      <section id="ventures" className="py-24 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-2">
            <p className="text-base text-foreground font-medium">
              We don&apos;t just respond to briefs — we initiate.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80} className="mb-12">
            <p className="text-sm text-muted-foreground max-w-lg">
              Alongside client work, Parti Design incubates its own projects: initiatives we believe
              in and build ourselves.
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-4">
            {VENTURES.map((venture, i) => (
              <AnimateOnScroll key={venture.slug} delay={i * 100}>
                <VentureCard {...venture} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Byggemenskap callout ───────────────────────────────────────── */}
      <section className="py-24 bg-lime">
        <div className="container text-center max-w-3xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-ink mb-6">
              Building homes together.
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-ink/80 leading-relaxed mb-10">
              Byggemenskap — community self-build housing — is one of the most powerful tools for
              affordable, community-rooted housing. Parti Design offers end-to-end support: from
              forming the organisation to designing and co-building the home.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md border-2 border-ink text-ink font-semibold hover:bg-ink hover:text-lime transition-colors"
            >
              Talk to us about byggemenskap
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 7. Contact / Closing CTA ─────────────────────────────────────── */}
      <section className="py-32 bg-ink">
        <div className="container text-center max-w-2xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-off-white mb-6">
              Let&apos;s build something together.
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-off-white/60 leading-relaxed mb-4">
              Whether you have a brief, an idea, or just a question — reach out.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={150}>
            <a
              href="mailto:kasimir@parti.design"
              className="block text-sm text-off-white/50 hover:text-lime transition-colors mb-10"
            >
              kasimir@parti.design
            </a>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-lime text-ink font-semibold hover:bg-lime/90 transition-colors"
            >
              Start a conversation
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
