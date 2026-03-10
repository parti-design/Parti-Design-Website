import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

export type VentureCardTheme = 'lime' | 'lavender' | 'ink'

export interface VentureCardProps {
  title: string
  tagline: string
  /** URL slug — links to /ventures/[slug] */
  slug: string
  /**
   * Card background theme. Determines background and text colours.
   *   lime     → bg-lime,     ink text
   *   lavender → bg-lavender, ink text
   *   ink      → bg-ink,      off-white text
   */
  theme?: VentureCardTheme
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
export function VentureCard({ title, tagline, slug, theme = 'lime', className, ctaLabel = 'Learn more' }: VentureCardProps) {
  const colors = themeClasses[theme]

  return (
    <Link
      href={`/ventures/${slug}`}
      className={cn(
        'group flex flex-col justify-between p-8 min-h-[260px] rounded-md',
        'hover:-rotate-1 hover:shadow-xl transition-all duration-300',
        colors.bg,
        className,
      )}
    >
      <SectionHeading as="h3" size="md" className={cn('mb-4', colors.text)}>
        {title}
      </SectionHeading>
      <div>
        <p className={cn('text-sm leading-relaxed mb-6', colors.muted)}>{tagline}</p>
        <span className={cn('text-sm font-semibold group-hover:underline', colors.text)}>
          {ctaLabel} →
        </span>
      </div>
    </Link>
  )
}
