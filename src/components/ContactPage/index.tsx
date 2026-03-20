import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tag } from '@/components/ui/Tag'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import React from 'react'

import { ContactForm } from './ContactForm'

export async function ContactPage() {
  const t = await getTranslations('contact')

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact Form' } },
    limit: 1,
  })
  const formId = docs[0]?.id ?? null

  const contactDetails = [
    { label: t('emailLabel'), value: 'hej@parti.design', href: 'mailto:hej@parti.design' },
    { label: t('basedLabel'), value: t('basedValue'), href: null },
    { label: t('workingLabel'), value: t('workingValue'), href: null },
  ]

  return (
    <main>
      <PageHeader
        tag={t('tag')}
        heading={t('heading')}
        body={t('body')}
      />

      <section className="py-24 bg-background">
        <div className="container grid lg:grid-cols-5 gap-16 items-start">
          {/* Left column — contact info */}
          <div className="lg:col-span-2 space-y-10">
            <AnimateOnScroll>
              <div className="space-y-6">
                {contactDetails.map((d) => (
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
                <Tag className="text-lime">{t('byggemenskapTag')}</Tag>
                <p className="text-sm text-foreground font-medium leading-snug">
                  {t('byggemenskapHeading')}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('byggemenskapBody')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120}>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('replyNote')}
              </p>
            </AnimateOnScroll>
          </div>

          {/* Right column — form */}
          <AnimateOnScroll delay={100} className="lg:col-span-3">
            <ContactForm formId={formId} />
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
