import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tag } from '@/components/ui/Tag'
import React from 'react'

import { ContactForm } from './ContactForm'

const CONTACT_DETAILS = [
  { label: 'Email', value: 'kasimir@parti.design', href: 'mailto:kasimir@parti.design' },
  { label: 'Based in', value: 'Umeå, Sweden', href: null },
  { label: 'Working', value: 'Internationally', href: null },
]

export function ContactPage() {
  return (
    <main>
      <PageHeader
        tag="Contact"
        heading="Let's build something together."
        body="Whether you have a brief, a rough idea, or just a question — we'd love to hear from you."
      />

      <section className="py-24 bg-background">
        <div className="container grid lg:grid-cols-5 gap-16 items-start">
          {/* Left column — contact info */}
          <div className="lg:col-span-2 space-y-10">
            <AnimateOnScroll>
              <div className="space-y-6">
                {CONTACT_DETAILS.map((d) => (
                  <div key={d.label} className="space-y-1">
                    <Tag>{d.label}</Tag>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="block text-base font-medium text-foreground hover:text-lime transition-colors"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-foreground">{d.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={80}>
              <div className="p-6 bg-muted/40 rounded-md space-y-3 border border-border">
                <Tag className="text-lime">Byggemenskap</Tag>
                <p className="text-sm text-foreground font-medium leading-snug">
                  Thinking about building a home together?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We offer end-to-end support for community self-build housing groups — from
                  forming the cooperative to designing and co-building the home. Reach out and
                  let&apos;s talk.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120}>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We usually reply within a couple of days. For urgent matters, email directly.
              </p>
            </AnimateOnScroll>
          </div>

          {/* Right column — form */}
          <AnimateOnScroll delay={100} className="lg:col-span-3">
            <ContactForm />
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
