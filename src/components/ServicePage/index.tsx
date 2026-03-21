import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { ProjectCard, type ProjectCardProps } from '@/components/ProjectCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ServiceFAQ } from './ServiceFAQ'
import { RegenerativeDiagramClient } from './RegenerativeDiagramClient'

type ServiceNamespace = 'architecturePage' | 'digitalDesignPage' | 'coDesignPage'

interface Props {
  locale: string
  namespace: ServiceNamespace
  /** Path to a full-bleed hero image (relative to /public). Omit to use the colour fallback. */
  heroImage?: string
  /** Pre-filtered projects relevant to this service. */
  projects?: ProjectCardProps[]
}

export async function ServicePage({ locale, namespace, heroImage, projects = [] }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (await getTranslations({ locale, namespace: namespace as any })) as any
  const offerItems = t.raw('offer') as Array<{ label: string; body: string }>
  const processSteps = t.raw('process.steps') as Array<{
    number: string
    label: string
    body: string
  }>
  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>

  return (
    <main>
      {/* ── 1. Two-column intro ──────────────────────────────────────────── */}
      <section className="pt-28 md:pt-32 lg:pt-40 pb-16 md:pb-24 bg-background">
        <div className="container">
          <AnimateOnScroll className="mb-5">
            <Tag>{t('tag')}</Tag>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            {/* Left: heading */}
            <AnimateOnScroll delay={60}>
              <SectionHeading as="h1" size="xl">
                {t('heading')}
              </SectionHeading>
            </AnimateOnScroll>

            {/* Right: body — now top-aligns with the headline */}
            <div className="space-y-5">
              <AnimateOnScroll delay={100}>
                <p className="text-lg text-muted-foreground leading-relaxed">{t('intro')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={160}>
                <p className="text-base text-muted-foreground leading-relaxed">{t('body2')}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Quote — full-bleed image or colour fallback ──────────────── */}
      {heroImage ? (
        <section className="relative min-h-[420px] md:min-h-[560px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" />
          <div className="relative z-10 container py-16 md:py-24">
            <div className="max-w-xl">
              <AnimateOnScroll>
                <p className="font-display text-3xl md:text-4xl xl:text-5xl text-off-white italic leading-tight">
                  &ldquo;{t('quote')}&rdquo;
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-lavender py-24 md:py-36">
          <div className="container max-w-2xl">
            <AnimateOnScroll>
              <p className="font-display text-3xl md:text-4xl xl:text-5xl text-ink italic leading-tight">
                &ldquo;{t('quote')}&rdquo;
              </p>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── 3. Regenerative paradigm diagram (coDesignPage only) ───────── */}
      {namespace === 'coDesignPage' && (
        <section className="py-20 md:py-32 lg:py-40 border-t border-border relative overflow-hidden">
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage: 'url(/assets/background-gradient.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(0px)',
            }}
          />
          <div className="container grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <AnimateOnScroll>
                <SectionHeading className="mb-6">{t('paradigm.heading')}</SectionHeading>
              </AnimateOnScroll>
              <AnimateOnScroll delay={80}>
                <p className="text-lg leading-relaxed mb-8 text-ink/80">
                  {t('paradigm.body')}
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={140}>
                <p className="text-sm italic text-ink/50">{t('paradigm.attribution')}</p>
              </AnimateOnScroll>
            </div>
            <AnimateOnScroll delay={100}>
              <RegenerativeDiagramClient />
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── 4. What this includes ───────────────────────────────────────── */}
      <section className="py-20 md:py-32 lg:py-40 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{t('offerHeading')}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-8">
            {offerItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={i * 80}>
                <div className="space-y-2 p-6 border border-border rounded-md hover:-translate-y-1 transition-transform duration-300">
                  <Tag className="text-lime">{item.label}</Tag>
                  <p className="text-base text-foreground font-medium leading-snug">{item.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How we work — process steps ──────────────────────────────── */}
      <section className="py-20 md:py-32 lg:py-40 bg-background border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-14">
            <SectionHeading>{t('process.heading')}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <AnimateOnScroll key={step.number} delay={i * 80}>
                <div className="space-y-3">
                  <span className="font-display text-5xl font-bold text-lime/40 leading-none">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{step.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Featured projects ────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="py-20 md:py-32 lg:py-40 bg-muted/40 border-t border-border">
          <div className="container">
            <AnimateOnScroll className="mb-12">
              <SectionHeading>{t('featuredWork.heading')}</SectionHeading>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:auto-rows-[280px]">
              {projects.slice(0, 3).map((project, i) => (
                <AnimateOnScroll key={project.slug} delay={i * 80}>
                  <ProjectCard {...project} />
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll delay={200} className="mt-10">
              <Link
                href="/work"
                className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-lime transition-colors"
              >
                {locale === 'sv' ? 'Se allt arbete' : 'See all work'}{' '}
                <span aria-hidden>→</span>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── 6. FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 lg:py-40 bg-background border-t border-border">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <AnimateOnScroll>
            <SectionHeading size="lg">{t('faq.heading')}</SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80}>
            <ServiceFAQ items={faqItems} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── 7. CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 lg:py-40 bg-ink">
        <div className="container text-center max-w-2xl mx-auto">
          <AnimateOnScroll>
            <SectionHeading size="xl" className="text-off-white mb-6">
              {t('cta.heading')}
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg text-off-white/60 leading-relaxed mb-10">{t('cta.body')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-md bg-lime text-ink font-semibold hover:bg-lime/90 transition-colors"
            >
              {t('cta.button')}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
