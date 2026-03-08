import { Tag } from '@/components/ui/Tag'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

export interface ProjectCardProps {
  title: string
  tags: string[]
  description: string
  /** URL slug — links to /work/[slug] */
  slug: string
  /** Spans 2 grid rows/columns for the featured hero card */
  large?: boolean
  /** Optional image path (e.g. /images/projects/umea-kallbad/hero.jpg) */
  imageSrc?: string
  className?: string
}

/**
 * Project portfolio card — used on the homepage and /work page.
 *
 * Image placeholder is shown when imageSrc is not provided.
 * On hover: image scales 1.03×, description overlay fades in.
 *
 * Grid layout is controlled by the parent. This component fills
 * 100% of the cell it is placed in.
 */
export function ProjectCard({
  title,
  tags,
  description,
  slug,
  large = false,
  imageSrc,
  className,
}: ProjectCardProps) {
  return (
    <Link
      href={`/work/${slug}`}
      className={cn('group relative flex bg-muted overflow-hidden', className)}
      style={{ minHeight: large ? 480 : 280 }}
    >
      {/* Background — real image or placeholder gradient */}
      {imageSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-secondary/20 group-hover:scale-[1.03] transition-transform duration-500" />
      )}

      {/* Hover description overlay */}
      <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <p className="text-off-white text-sm leading-relaxed">{description}</p>
      </div>

      {/* Info bar — always visible at card bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-ink/70 to-transparent">
        <p className="font-semibold text-off-white mb-1">{title}</p>
        <Tag className="text-off-white/70">{tags.join(' · ')}</Tag>
      </div>
    </Link>
  )
}
