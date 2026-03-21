import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import Image from 'next/image'
import Link from 'next/link'

import { InterestForm } from './InterestForm'

interface Props {
  locale: string
}

export async function ByggememskapPage({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'byggemenskapPage' })

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Byggemenskap Interest' } },
    limit: 1,
  })
  const formId = docs[0]?.id ?? null

  const valueItems = t.raw('valueItems') as Array<{ label: string; body: string }>
  const grantItems = t.raw('grantItems') as string[]

  return (
    <main>
      {/* Hero */}
      <section className="pt-28 md:pt-32 lg:pt-40 pb-14 md:pb-18 lg:pb-24 bg-background">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <AnimateOnScroll>
              <Tag className="mb-5">{t('tag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <SectionHeading as="h1" size="xl" className="max-w-3xl">
                {t('heading')}
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {t('intro')}
              </p>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll delay={100} className="relative aspect-[4/3] rounded-md overflow-hidden hidden lg:block">
            <Image
              src="/assets/byggemenskap/bram-van-oost-6p0GlIS4L7Y-unsplash.jpg"
              alt="Community dinner at a co-built space — photo by Bram Van Oost"
              fill
              className="object-cover object-center"
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Value of byggemenskap */}
      <section className="py-28 md:py-40 lg:py-52 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{t('valueHeading')}</SectionHeading>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {valueItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={i * 80}>
                <div className="space-y-2 p-6 border border-border rounded-md">
                  <Tag className="text-lime">{item.label}</Tag>
                  <p className="text-base text-foreground font-medium leading-snug">{item.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Co-design — text left, images right */}
      <section className="py-28 md:py-40 lg:py-52 bg-background border-t border-border">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — text */}
          <div>
            <AnimateOnScroll>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
                {t('processHeading')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={40}>
              <Tag className="mb-4">{t('codesignTag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={80}>
              <SectionHeading className="mb-6">{t('codesignHeading')}</SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={140}>
              <p className="text-lg text-muted-foreground leading-relaxed">{t('codesignBody')}</p>
            </AnimateOnScroll>
          </div>

          {/* Right — images stacked */}
          <div className="grid gap-4">
            <AnimateOnScroll delay={100}>
              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                <Image
                  src="/assets/byggemenskap/umea-together-codesign.jpg"
                  alt="Co-design workshop — presenter at a large collaborative vision diagram"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={180}>
              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                <Image
                  src="/assets/byggemenskap/waste-to-wonder-workshop.jpg"
                  alt="Participants working around a design table during a co-design workshop"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Co-building — images left, text right */}
      <section className="py-28 md:py-40 lg:py-52 bg-muted/40 border-t border-border">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Images — shown first on mobile, moved left on desktop */}
          <div className="grid gap-4 order-last lg:order-first">
            <AnimateOnScroll delay={100}>
              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                <Image
                  src="/assets/byggemenskap/kotten-sauna-winter-build.jpg"
                  alt="Volunteers building the sauna structure together in winter"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={180}>
              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                <Image
                  src="/assets/byggemenskap/kotten-changing-rooms-cobuild.jpg"
                  alt="Three people laughing while working with timber on the co-building site"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right — text */}
          <div>
            <AnimateOnScroll>
              <Tag className="mb-4">{t('cobuildTag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <SectionHeading className="mb-6">{t('cobuildHeading')}</SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <p className="text-lg text-muted-foreground leading-relaxed">{t('cobuildBody')}</p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Open Collective */}
      <section className="py-28 md:py-40 lg:py-52 bg-background border-t border-border">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <AnimateOnScroll>
              <Tag className="mb-4">{t('opencollectiveTag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <SectionHeading className="mb-6">{t('opencollectiveHeading')}</SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t('opencollectiveBody')}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={180}>
              <a
                href="https://opencollective.com/massvis/apply"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold hover:bg-ink/90 transition-colors"
              >
                {t('opencollectiveCta')}
              </a>
            </AnimateOnScroll>
          </div>

          {/* Right — Open Collective dashboard illustration */}
          <AnimateOnScroll delay={100} className="relative aspect-square">
            <Image
              src="/assets/ventures/massvis-hero-illustration.webp"
              alt="Open Collective fundraising and budgeting dashboard"
              fill
              className="object-contain"
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Boverket grant */}
      <section
        className="relative py-24 md:py-32 lg:py-40 border-t border-border overflow-hidden"
        style={{ backgroundColor: '#c10b25' }}
      >
        {/* Decorative concentric circles — top right */}
        <div className="absolute -right-24 -top-24 w-[32rem] h-[32rem] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-8 top-8 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />

        <div className="container relative z-10">
          <AnimateOnScroll>
            <Tag className="text-off-white/50 mb-8">{t('grantTag')}</Tag>
          </AnimateOnScroll>

          {/* h2 headline */}
          <AnimateOnScroll delay={60}>
            <SectionHeading as="h2" size="lg" className="text-off-white mb-4">
              {t('grantTitle')}
            </SectionHeading>
          </AnimateOnScroll>

          {/* Amount */}
          <AnimateOnScroll delay={100}>
            <p className="font-display font-bold text-off-white/40 text-2xl mb-12">400 000 SEK</p>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — explanation */}
            <div>
              <AnimateOnScroll delay={120}>
                <p className="text-lg text-off-white/80 font-medium leading-snug mb-4">{t('grantBody')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={160}>
                <p className="text-sm text-off-white/50 leading-relaxed mb-4">{t('grantCta')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-md border border-white/30 text-off-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {t('grantCtaLink')}
                </Link>
              </AnimateOnScroll>
            </div>

            {/* Right — requirements as numbered cards */}
            <div>
              <AnimateOnScroll delay={120}>
                <p className="text-xs font-semibold text-off-white/40 uppercase tracking-widest mb-5">
                  {t('grantRequirements')}
                </p>
              </AnimateOnScroll>
              <div className="space-y-3">
                {grantItems.map((item, i) => (
                  <AnimateOnScroll key={i} delay={140 + i * 80}>
                    <div className="flex items-start gap-4 p-4 rounded-md border border-white/15 bg-white/5">
                      <span
                        className="font-display font-bold text-off-white leading-none shrink-0"
                        style={{ fontSize: '1.75rem' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-off-white/70 text-sm leading-relaxed pt-1">{item}</span>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the movement */}
      <section className="relative py-32 md:py-48 lg:py-64 border-t border-border overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/Ume%C3%A5_River_View.jpg"
            alt="Umeå river view"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20" />

        <div className="relative z-10 container">
          <div className="max-w-lg">
            <AnimateOnScroll>
              <Tag className="mb-4">{t('interestTag')}</Tag>
            </AnimateOnScroll>
            <AnimateOnScroll delay={60}>
              <SectionHeading size="xl" className="mb-4">
                {t('interestHeading')}
              </SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120}>
              <p className="text-lg text-ink/70 leading-relaxed mb-10">{t('interestBody')}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={180}>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 rounded-md border-2 border-ink/50 text-ink font-semibold hover:bg-ink hover:text-off-white transition-colors"
              >
                {t('interestCta')}
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* For municipalities & funders */}
      <section className="py-28 md:py-40 lg:py-52 bg-muted/40 border-t border-border">
        <div className="container max-w-3xl">
          <AnimateOnScroll>
            <Tag className="mb-4">{t('institutionalTag')}</Tag>
          </AnimateOnScroll>
          <AnimateOnScroll delay={60}>
            <SectionHeading size="xl" className="mb-6">
              {t('institutionalHeading')}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={120}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t('institutionalBody')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={180}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold hover:bg-ink/90 transition-colors"
            >
              {t('institutionalCta')}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
