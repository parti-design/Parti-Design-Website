import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  tag?: string
  heading: string
  body?: string
  /** true = ink background (default), false = off-white background */
  dark?: boolean
  className?: string
}

/**
 * Full-width page intro header — used at the top of every non-home page.
 *
 * Usage:
 *   <PageHeader tag="Portfolio" heading="Work that builds places." body="..." />
 *   <PageHeader dark={false} heading="Get in touch" />
 */
export function PageHeader({ tag, heading, body, dark = true, className }: Props) {
  return (
    <section className={cn('pt-40 pb-24', dark ? 'bg-ink' : 'bg-background', className)}>
      <div className="container">
        {tag && (
          <AnimateOnScroll>
            <Tag className={cn('mb-5', dark ? 'text-lime' : '')}>{tag}</Tag>
          </AnimateOnScroll>
        )}
        <AnimateOnScroll delay={60}>
          <SectionHeading as="h1" size="xl" className={cn('max-w-3xl', dark ? 'text-off-white' : '')}>
            {heading}
          </SectionHeading>
        </AnimateOnScroll>
        {body && (
          <AnimateOnScroll delay={120}>
            <p
              className={cn(
                'mt-6 text-lg leading-relaxed max-w-2xl',
                dark ? 'text-off-white/65' : 'text-muted-foreground',
              )}
            >
              {body}
            </p>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  )
}
