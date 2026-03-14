'use client'

import { AnimateOnScroll } from '@/components/HomePage/AnimateOnScroll'
import { ProjectCard, type ProjectCardProps } from '@/components/ProjectCard'
import React from 'react'

type FilterKey = 'all' | 'architecture' | 'coBuilding' | 'digital' | 'facilitation'

const FILTER_TO_SERVICE: Record<Exclude<FilterKey, 'all'>, string> = {
  architecture: 'architecture-spatial',
  coBuilding: 'co-design-workshops',
  digital: 'ux-ui-digital',
  facilitation: 'facilitation-project-management',
}

export interface FilterableProjectCard extends ProjectCardProps {
  serviceKeys: string[]
}

interface Props {
  projects: FilterableProjectCard[]
  filterLabels: Record<FilterKey, string>
}

export function WorkPageClient({ projects, filterLabels }: Props) {
  const filterOrder: FilterKey[] = ['all', 'architecture', 'coBuilding', 'digital', 'facilitation']
  const [activeFilter, setActiveFilter] = React.useState<FilterKey>('all')

  const visibleProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) =>
          project.serviceKeys.includes(FILTER_TO_SERVICE[activeFilter as Exclude<FilterKey, 'all'>]),
        )

  return (
    <>
      <AnimateOnScroll className="mb-10 flex flex-wrap gap-2">
        {filterOrder.map((filter) => {
          const isActive = activeFilter === filter

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={[
                'px-4 py-1.5 rounded-full border text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ink text-off-white border-ink'
                  : 'border-border text-muted-foreground hover:border-ink hover:text-foreground',
              ].join(' ')}
              aria-pressed={isActive}
            >
              {filterLabels[filter]}
            </button>
          )
        })}
      </AnimateOnScroll>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleProjects.map((project, i) => (
          <AnimateOnScroll key={`${activeFilter}-${project.slug}`} delay={i * 60}>
            <ProjectCard {...project} />
          </AnimateOnScroll>
        ))}
      </div>
    </>
  )
}
