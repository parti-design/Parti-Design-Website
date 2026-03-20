'use client'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'

export type StageKey = 'seed' | 'root' | 'sprout' | 'grow' | 'flourish'

export interface Stage {
  key: StageKey
  name: string
  description: string
}

interface Props {
  stages: Stage[]
}

const LEAF = '#78c83a'

// Tree-ring radii — each ring sits 5px outside the last
const RING_RADII = [6, 11, 16, 21, 22]
// Inner rings boldest, outer rings fade out
const RING_OPACITIES = [0.9, 0.6, 0.35, 0.18, 0.08]
// Number of rings per stage (not counting centre dot)
const RING_COUNTS: Record<StageKey, number> = {
  seed: 1,
  root: 2,
  sprout: 3,
  grow: 4,
  flourish: 5,
}

function dash(active: boolean, delay: number): React.CSSProperties {
  return {
    strokeDasharray: 1,
    strokeDashoffset: active ? 0 : 1,
    transition: `stroke-dashoffset 0.55s ease ${delay}ms`,
  }
}

function RingsIcon({ ringCount, active }: { ringCount: number; active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" width={64} height={64} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      {/* Centre dot — always present */}
      <circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none" />
      {/* Rings draw in from innermost outward on hover */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <circle
          key={i}
          cx="24"
          cy="24"
          r={RING_RADII[i]}
          pathLength="1"
          style={{ ...dash(active, i * 110), opacity: RING_OPACITIES[i] }}
        />
      ))}
    </svg>
  )
}

export function VentureStageStrip({ stages }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6">
      {stages.map((stage, i) => {
        const ringCount = RING_COUNTS[stage.key]
        const isActive = activeIndex === i

        return (
          <div
            key={stage.key}
            className="cursor-default select-none"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Two-layer illustration — ghost always visible, active draws in on hover */}
            <div className="relative hidden md:flex h-16 mb-5">
              {/* Ghost: fully drawn. Fades out when hovered. */}
              <div
                className={cn(
                  'absolute inset-0 transition-opacity duration-200',
                  isActive ? 'opacity-0' : 'opacity-100',
                )}
                style={{ color: LEAF }}
              >
                <RingsIcon ringCount={ringCount} active={true} />
              </div>

              {/* Active: rings draw in from centre outward. */}
              <div
                className={cn(
                  'absolute inset-0 transition-opacity duration-150',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
                style={{ color: LEAF }}
              >
                <RingsIcon ringCount={ringCount} active={isActive} />
              </div>
            </div>

            <p
              className="text-xs font-semibold uppercase tracking-[0.08em] mb-2"
              style={{ color: LEAF }}
            >
              {stage.name}
            </p>

            <p className="text-sm leading-relaxed text-off-white/70">
              {stage.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
