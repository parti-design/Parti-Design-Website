import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

/**
 * All-caps metadata tag — used for category labels, service tags, type indicators.
 *
 * Usage:
 *   <Tag>Workshop Facilitation</Tag>
 *   <Tag className="text-lime">Digital</Tag>
 *   {tags.join(' · ')} — join multiple tags inline before passing to Tag
 */
export function Tag({ children, className }: Props) {
  return (
    <p
      className={cn(
        'text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}
