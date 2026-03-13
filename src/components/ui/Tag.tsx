import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * All-caps metadata tag — used for category labels, service tags, type indicators.
 *
 * Usage:
 *   <Tag>Workshop Facilitation</Tag>
 *   <Tag className="text-lime">Digital</Tag>
 *   {tags.join(' · ')} — join multiple tags inline before passing to Tag
 */
export function Tag({ children, className, style }: Props) {
  return (
    <p
      style={style}
      className={cn(
        'text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}
