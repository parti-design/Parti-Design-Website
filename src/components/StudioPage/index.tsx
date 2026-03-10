import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import React from 'react'

const VALUES = [
  {
    label: 'Participatory',
    body: 'We believe communities are the experts of their own places. Every project begins by listening.',
  },
  {
    label: 'Holistic',
    body: 'A single project might combine architecture, facilitation, branding, and a website. We work across the whole problem.',
  },
  {
    label: 'Regenerative',
    body: 'We design for long-term flourishing, not short-term delivery. Buildings and platforms should outlast the brief.',
  },
  {
    label: 'Open',
    body: 'We share methods, use open-source tools, and work in public where we can. Good ideas spread further when they\'re shared.',
  },
]

const SERVICES = [
  {
    label: 'Architecture',
    body: 'New buildings, spatial interventions, co-building workshops, WikiHouse construction, byggemenskap support.',
  },
  {
    label: 'Digital',
    body: 'Websites, platforms, digital services, UX/UI design, community tools, and product development.',
  },
  {
    label: 'Social',
    body: 'Co-design facilitation, community engagement, placemaking strategy, workshop series, and grant consulting.',
  },
]

export function StudioPage() {
  return (
    <main>
      <PageHeader
        tag="Studio"
        heading="An architecture studio that builds differently."
        body="Founded in 2022 in Umeå, Sweden. We work at the intersection of architecture, digital design, and community facilitation."
      />

      {/* About section */}
      <section className="py-24 bg-background">
        <div className="container grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3 space-y-6">
            <AnimateOnScroll>
              <SectionHeading>The studio.</SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={80}>
              <p className="text-base text-muted-foreground leading-relaxed">
                Parti Design was founded in 2022 by Kasimir and Karina while still studying — as a
                vessel for their creative, research, and community interests. The name means three
                things: participatory design, the French <em>parti</em> (the concept diagram that
                drives an architectural idea), and a refusal to take architecture too seriously.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120}>
              <blockquote className="border-l-4 border-lime pl-6 py-2 my-4">
                <p className="font-sans text-2xl md:text-3xl italic text-foreground leading-snug">
                  &ldquo;Citizens are the experts of place.&rdquo;
                </p>
              </blockquote>
            </AnimateOnScroll>

            <AnimateOnScroll delay={160}>
              <p className="text-base text-muted-foreground leading-relaxed">
                The studio operates as both a practice and a venture studio — incubating its own
                initiatives alongside client work. A single project might combine architecture,
                workshop facilitation, branding, and a website. That&apos;s not a coincidence; it&apos;s the
                point.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="text-base text-muted-foreground leading-relaxed">
                Based in Umeå, Sweden — but we work wherever the project takes us.
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={120} className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/team/Karina%20and%20Kasimir%20Parti%20Design%20Photo.jpg"
              alt="Karina and Kasimir — founders of Parti Design"
              className="w-full aspect-[3/4] object-cover object-top rounded-md"
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>The team.</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
            <AnimateOnScroll delay={80}>
              <div className="space-y-3">
                <Tag>Co-founder</Tag>
                <p className="font-display font-bold text-xl text-foreground">Kasimir Suter Winter</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Architecture, digital development, and co-building. Kasimir leads technical
                  design, construction projects, and digital platforms. He has a particular interest
                  in open-source building systems and community land models.
                </p>
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
                <Tag>Co-founder</Tag>
                <p className="font-display font-bold text-xl text-foreground">Karina Suter Winter</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Architecture, graphic design, and facilitation. Karina leads visual communication,
                  co-design processes, and spatial design. She brings a sharp eye for aesthetics
                  and a deep commitment to participatory methods.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>How we work.</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {VALUES.map((v, i) => (
              <AnimateOnScroll key={v.label} delay={i * 80}>
                <div className="space-y-2 p-6 border border-border rounded-md hover:-translate-y-1 transition-transform duration-300">
                  <Tag className="text-lime">{v.label}</Tag>
                  <p className="text-base text-foreground font-medium leading-snug">{v.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-secondary/20 border-t border-ink/10">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>What we offer.</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
            {SERVICES.map((s, i) => (
              <AnimateOnScroll key={s.label} delay={i * 100} className="px-0 md:px-10 first:pl-0 last:pr-0 py-10 md:py-0">
                <Tag className="mb-4">{s.label}</Tag>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-ink">
        <div className="container text-center max-w-2xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-off-white mb-6">
              Let&apos;s work together.
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80}>
            <p className="text-off-white/60 leading-relaxed mb-10">
              Whether you have a brief, a rough idea, or a community problem that needs solving —
              we&apos;d love to hear from you.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={140}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-lime text-ink font-semibold hover:bg-lime/90 transition-colors"
            >
              Get in touch
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
