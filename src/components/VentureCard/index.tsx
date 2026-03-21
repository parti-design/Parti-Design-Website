import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'
import { fallbackVentureColors, isDarkHexColor, resolveVentureColor, rgbaFromHex } from '@/lib/venture-colors'
import { cn } from '@/utilities/ui'
import React from 'react'

export type VentureCardTheme = 'lime' | 'lavender' | 'ink'

export interface VentureCardProps {
  title: string
  tagline: string
  /** URL slug — links to /ventures/[slug] */
  slug: string
  location?: string | null
  status?: string | null
  /**
   * Card background theme. Determines background and text colours.
   *   lime     → bg-lime,     ink text
   *   lavender → bg-lavender, ink text
   *   ink      → bg-ink,      off-white text
   */
  theme?: VentureCardTheme
  accentColor?: string | null
  image?: string | null
  className?: string
  ctaLabel?: string
}

const themeClasses: Record<VentureCardTheme, { bg: string; text: string; muted: string }> = {
  lime: {
    bg: 'bg-lime',
    text: 'text-ink',
    muted: 'text-ink/70',
  },
  lavender: {
    bg: 'bg-lavender',
    text: 'text-ink',
    muted: 'text-ink/70',
  },
  ink: {
    bg: 'bg-ink',
    text: 'text-off-white',
    muted: 'text-off-white/70',
  },
}

/**
 * Venture card — used on the homepage and /ventures page.
 *
 * On hover: subtle tilt + shadow lift (playful, living feel).
 *
 * Usage:
 *   <VentureCard title="Massvis" tagline="..." slug="massvis" theme="lime" />
 */
export function VentureCard({
  title,
  tagline,
  slug,
  location,
  status,
  theme = 'lime',
  accentColor,
  image,
  className,
  ctaLabel = 'Learn more',
}: VentureCardProps) {
  const colors = themeClasses[theme]
  const resolvedAccent = resolveVentureColor(accentColor, theme)
  const isDark = isDarkHexColor(resolvedAccent)
  const textColor = isDark ? '#f7f3ec' : fallbackVentureColors.ink
  const mutedColor = rgbaFromHex(textColor, 0.72)

  return (
    <Link
      href={`/ventures/${slug}`}
      style={{ backgroundColor: resolvedAccent, color: textColor }}
      className={cn(
        'group flex flex-col rounded-md overflow-hidden',
        'hover:-rotate-1 hover:shadow-xl transition-all duration-300',
        className,
      )}
    >
      {/* Image — top */}
      {image && (
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Text — below */}
      <div className="flex flex-col flex-1 p-8 min-h-[240px]">
        <div>
          <SectionHeading
            as="h3"
            size="md"
            style={{ color: textColor }}
            className={cn('mb-0', !accentColor && colors.text)}
          >
            {title}
          </SectionHeading>
          <div className="mt-8 space-y-3">
            {(location || status) && (
              <div
                style={accentColor ? { color: mutedColor } : undefined}
                className={cn('flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.08em]', !accentColor && colors.muted)}
              >
                {location && <span>{location}</span>}
                {status && <span>{status}</span>}
              </div>
            )}
            <p
              style={accentColor ? { color: mutedColor } : undefined}
              className={cn('text-sm leading-relaxed', !accentColor && colors.muted)}
            >
              {tagline}
            </p>
          </div>
        </div>
        <span className="mt-auto pt-8" style={accentColor ? { color: textColor } : undefined}>
          <span className={cn('text-sm font-semibold group-hover:underline', !accentColor && colors.text)}>
            {ctaLabel} →
          </span>
        </span>
      </div>

    </Link>
  )
}
