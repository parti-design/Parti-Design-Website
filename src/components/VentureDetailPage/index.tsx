import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { Gallery } from '@/components/ProjectDetailPage/Gallery'
import RichText from '@/components/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { Link } from '@/i18n/navigation'
import { fallbackVentureColors, isDarkHexColor, resolveVentureColor, rgbaFromHex } from '@/lib/venture-colors'
import { mediaUrl, serviceLabels } from '@/lib/payload-queries'
import { getVentureDraft } from '@/lib/venture-drafts'
import { normalizeVentureStatus } from '@/lib/venture-status'
import type { Venture } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { getTranslations } from 'next-intl/server'
import React from 'react'

interface Props {
  venture: Venture
  locale: 'en' | 'sv'
}

type VentureStatusKey = 'seed' | 'root' | 'sprout' | 'grow' | 'flourish'

export async function VentureDetailPage({ venture, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'ventureDetail' })
  const statusT = await getTranslations({ locale, namespace: 'venturesPage.status' })

  const draft = getVentureDraft(venture.slug, locale)
  const tags = serviceLabels(venture.services, locale)
  const normalizedStatus = normalizeVentureStatus(venture.ventureStatus) as VentureStatusKey | null | undefined
  const statusLabel = normalizedStatus ? statusT(normalizedStatus) : null
  const fallbackTheme = draft?.theme ?? 'lavender'
  const accentColor = resolveVentureColor(venture.themeColor, fallbackTheme)
  const accentTextColor = isDarkHexColor(accentColor) ? '#f7f3ec' : fallbackVentureColors.ink
  const accentSoft = rgbaFromHex(accentColor, 0.16)
  const accentSoftDark = rgbaFromHex(accentColor, 0.12)
  const coverUrl = mediaUrl(venture.coverImage, 'xlarge') ?? mediaUrl(venture.coverImage, 'large') ?? draft?.coverImage
  const cmsGalleryImages =
    venture.gallery?.map((item) => {
      const src = mediaUrl(item.image, 'large') ?? mediaUrl(item.image)
      const fullSrc = mediaUrl(item.image, 'xlarge') ?? mediaUrl(item.image, 'large') ?? mediaUrl(item.image)
      return src ? { src, fullSrc, caption: item.caption ?? undefined } : null
    }) ?? []
  const galleryImages: Array<{ src: string; fullSrc?: string; caption?: string }> =
    cmsGalleryImages.length > 0
      ? cmsGalleryImages.filter(
          (
            item,
          ): item is NonNullable<(typeof cmsGalleryImages)[number]> => item !== null,
        )
      : draft?.gallery.map((image) => ({ src: image.src, fullSrc: image.src, caption: image.caption })) ?? []

  const externalUrl = venture.externalUrl || draft?.externalUrl

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background dark:bg-ink">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={venture.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${rgbaFromHex(accentColor, 0.35)}, rgba(248, 245, 239, 0.95), rgba(248, 245, 239, 1))`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/35 dark:from-ink dark:via-ink/65 dark:to-transparent" />

        <div className="container relative z-10 flex min-h-[68vh] items-end py-16 pt-40">
          <div className="max-w-4xl space-y-6">
            <AnimateOnScroll>
              <Tag style={{ color: accentColor }}>{t('eyebrow')}</Tag>
            </AnimateOnScroll>

            <AnimateOnScroll delay={60}>
              <SectionHeading as="h1" size="xl" className="max-w-3xl text-foreground dark:text-off-white">
                {venture.title}
              </SectionHeading>
            </AnimateOnScroll>

            {venture.tagline && (
              <AnimateOnScroll delay={110}>
                <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 dark:text-off-white/75">
                  {venture.tagline}
                </p>
              </AnimateOnScroll>
            )}

            {externalUrl && (
              <AnimateOnScroll delay={150}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: accentColor,
                      color: accentTextColor,
                    }}
                  >
                    {t('cta.projectPage')}
                  </a>
                </div>
              </AnimateOnScroll>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background dark:bg-ink">
        <div className="container grid gap-12 py-16 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.95fr)]">
          <div className="space-y-14">
            {venture.description && (
              <AnimateOnScroll>
                <section className="space-y-5">
                  <RichText data={venture.description} enableGutter={false} enableProse />
                </section>
              </AnimateOnScroll>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <AnimateOnScroll delay={80}>
              <div
                className="rounded-2xl p-6 shadow-sm ring-1 ring-border/70 dark:ring-white/10"
                style={{
                  backgroundColor: accentSoft,
                  borderColor: accentSoftDark,
                }}
              >
                <div className="space-y-4">
                  {statusLabel && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:text-off-white/45">
                        {t('meta.status')}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-foreground dark:text-off-white/85">
                        <span
                          aria-hidden
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: accentColor }}
                        />
                        <span>{statusLabel}</span>
                      </div>
                    </div>
                  )}

                  {venture.location && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:text-off-white/45">
                        {t('meta.location')}
                      </p>
                      <p className="mt-1 text-sm text-foreground dark:text-off-white/85">{venture.location}</p>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:text-off-white/45">
                        {t('meta.services')}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimateOnScroll>

            {draft?.quote && (
              <AnimateOnScroll delay={140}>
                <blockquote className="border-l-4 pl-5 py-2" style={{ borderColor: accentColor }}>
                  <p className="text-lg italic leading-snug text-foreground dark:text-off-white">
                    &ldquo;{draft.quote}&rdquo;
                  </p>
                </blockquote>
              </AnimateOnScroll>
            )}

            <AnimateOnScroll delay={180}>
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted/40 dark:text-off-white dark:hover:bg-white/5"
                  style={{ borderColor: accentColor }}
                >
                  {t('cta.contact')}
                </Link>
                <Link
                  href="/ventures"
                  className="inline-flex items-center justify-center text-sm font-semibold text-muted-foreground transition-colors"
                  style={{ color: accentColor }}
                >
                  {t('cta.allVentures')} <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section className="bg-background py-24">
          <div className="container space-y-8">
            <AnimateOnScroll>
              <SectionHeading size="md">{t('sections.gallery')}</SectionHeading>
            </AnimateOnScroll>
            <AnimateOnScroll delay={70}>
              <Gallery
                images={galleryImages}
                projectTitle={venture.title}
                labels={{
                  viewImage: t('gallery.viewImage'),
                  close: t('gallery.close'),
                  previousImage: t('gallery.previousImage'),
                  nextImage: t('gallery.nextImage'),
                  imageLabel: t('gallery.imageLabel'),
                  of: t('gallery.of'),
                }}
              />
            </AnimateOnScroll>
          </div>
        </section>
      )}
    </main>
  )
}
