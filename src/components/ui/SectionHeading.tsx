import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  size?: 'xl' | 'lg' | 'md'
  className?: string
  style?: React.CSSProperties
}

/**
 * Standard section heading using Expletus Sans.
 *
 * Sizes:
 *   xl  — hero/page titles          (text-5xl md:text-6xl)
 *   lg  — section headings          (text-4xl md:text-5xl)  ← default
 *   md  — sub-section headings      (text-2xl md:text-3xl)
 *
 * Usage:
 *   <SectionHeading>Selected work</SectionHeading>
 *   <SectionHeading as="h1" size="xl">New ways to build.</SectionHeading>
 */
export function SectionHeading({ children, as: Tag = 'h2', size = 'lg', className, style }: Props) {
  return (
    <Tag
      style={style}
      className={cn(
        'font-display font-bold text-foreground leading-tight',
        size === 'xl' && 'text-5xl md:text-6xl',
        size === 'lg' && 'text-4xl md:text-5xl',
        size === 'md' && 'text-2xl md:text-3xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
