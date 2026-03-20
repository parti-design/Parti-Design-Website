import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type ServiceNamespace = 'architecturePage' | 'digitalDesignPage' | 'coDesignPage'

interface Props {
  locale: string
  namespace: ServiceNamespace
}

export async function ServicePage({ locale, namespace }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (await getTranslations({ locale, namespace: namespace as any })) as any
  const offerItems = t.raw('offer') as Array<{ label: string; body: string }>

  return (
    <main>
      <PageHeader
        tag={t('tag')}
        heading={t('heading')}
        body={t('intro')}
      />

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="container max-w-3xl">
          <AnimateOnScroll>
            <p className="text-lg text-muted-foreground leading-relaxed">{t('body2')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-muted/40 border-t border-border">
        <div className="container">
          <AnimateOnScroll className="mb-12">
            <SectionHeading>{t('offerHeading')}</SectionHeading>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
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

      <section className="py-16 md:py-24 lg:py-32 bg-ink">
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
