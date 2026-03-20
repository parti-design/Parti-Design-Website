'use client'

import { useState } from 'react'

const PRINCIPLES = [
  {
    id: 'wholes',
    number: 1,
    name: 'Wholes',
    description:
      'Look at the level of wholeness. If it is unclear, look for the life — there you will find the whole.',
    // hover target rect (SVG coords)
    rx: 650, ry: 274, rw: 150, rh: 34,
    // text anchor
    tx: 655, ty: 300,
  },
  {
    id: 'essence',
    number: 2,
    name: 'Essence',
    description: 'Identify the unique qualities of that whole, the story of place.',
    rx: 460, ry: 381, rw: 165, rh: 34,
    tx: 465, ty: 407,
  },
  {
    id: 'potential',
    number: 3,
    name: 'Potential',
    description:
      'Ask what potential that unique essence has. How does the story of place manifest itself.',
    rx: 302, ry: 274, rw: 182, rh: 34,
    tx: 307, ty: 300,
  },
  {
    id: 'development',
    number: 4,
    name: 'Development',
    description:
      'Look for ways to develop that potential — work with it, build on it.',
    rx: 584, ry: 197, rw: 220, rh: 34,
    tx: 589, ty: 223,
  },
  {
    id: 'nestedness',
    number: 5,
    name: 'Nestedness',
    description:
      'Look for other levels of wholeness which your whole is a part of, or those that are a part of it.',
    rx: 630, ry: 118, rw: 205, rh: 34,
    tx: 635, ty: 144,
  },
  {
    id: 'nodal',
    number: 6,
    name: 'Nodal interventions',
    description:
      'Identify acupuncture points of transformation that can unlock flows through the different nested levels of the whole.',
    rx: 450, ry: 4, rw: 248, rh: 60,
    tx: 483, ty: 24,
    // second line of label
    tx2: 474, ty2: 54,
  },
  {
    id: 'fields',
    number: 7,
    name: 'Fields',
    description:
      'Create and engage with new fields of potential, unimaginable or undiscovered before — whole new sectors, paradigms, or services.',
    rx: 334, ry: 118, rw: 148, rh: 34,
    tx: 339, ty: 144,
  },
]

export function RegenerativeDiagramClient() {
  const [active, setActive] = useState<(typeof PRINCIPLES)[0] | null>(null)

  return (
    <div>
      <svg
        viewBox="0 0 844 423"
        className="w-full h-auto"
        style={{ fontFamily: 'inherit' }}
        aria-label="Seven First Principles of Regeneration diagram"
      >
        {/* ── Triangles ────────────────────────────────────────────── */}
        <path
          d="M526.952 197.543C527.947 196.121 530.053 196.121 531.048 197.543L644.61 359.816C645.77 361.473 644.585 363.75 642.562 363.75H415.438C413.415 363.75 412.23 361.473 413.39 359.816L526.952 197.543Z"
          stroke="white" strokeWidth="3" fill="none"
        />
        <path
          d="M530.048 240.457C529.053 241.879 526.947 241.879 525.952 240.457L412.39 78.1836C411.23 76.5267 412.415 74.2503 414.438 74.25L641.563 74.25C643.585 74.2503 644.77 76.5267 643.61 78.1836L530.048 240.457Z"
          stroke="white" strokeWidth="3" fill="none"
        />

        {/* ── Dashed centre line ───────────────────────────────────── */}
        <line
          x1={529} y1={218.5} x2={0} y2={218.5}
          stroke="white" strokeWidth="3" strokeDasharray="10 10"
        />

        {/* ── Static annotation labels ─────────────────────────────── */}
        <text fill="black" fontSize="22" fontFamily="inherit" opacity="0.55">
          <tspan x="51" y="142">outer work</tspan>
        </text>
        <text fill="black" fontSize="22" fontFamily="inherit" opacity="0.55">
          <tspan x="52" y="308">inner work</tspan>
        </text>

        {/* ── Interactive principle labels ─────────────────────────── */}
        {PRINCIPLES.map((p) => {
          const isActive = active?.id === p.id
          return (
            <g
              key={p.id}
              onMouseEnter={() => setActive(p)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* invisible hover target */}
              <rect x={p.rx} y={p.ry} width={p.rw} height={p.rh} fill="transparent" />

              {/* label text */}
              <text
                fill="black"
                fontSize="22"
                fontFamily="inherit"
                fontWeight={isActive ? '700' : '500'}
              >
                {p.id === 'nodal' ? (
                  <>
                    <tspan x={p.tx} y={p.ty}>{p.number}. Nodal</tspan>
                    <tspan x={p.tx2} y={p.ty2}>interventions</tspan>
                  </>
                ) : (
                  <tspan x={p.tx} y={p.ty}>
                    {p.number}. {p.name}
                  </tspan>
                )}
              </text>

              {/* active underline */}
              {isActive && (
                <line
                  x1={p.rx} y1={p.ry + p.rh + 1}
                  x2={p.rx + p.rw} y2={p.ry + p.rh + 1}
                  stroke="black" strokeWidth="1.5" opacity="0.35"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* ── Description card ─────────────────────────────────────────── */}
      <div className="mt-3">
        <p className="px-1 text-sm text-ink/50 italic mb-2">Hover over a principle to explore it</p>
        <div className={`h-[88px] px-4 py-3 rounded-md overflow-hidden transition-all duration-200 ${active ? 'bg-white/40 border border-white/40 backdrop-blur-sm' : 'border border-transparent'}`}>
          {active && (
            <>
              <p className="text-sm font-semibold text-ink mb-1">
                {active.number}. {active.name}
              </p>
              <p className="text-sm text-ink/75 leading-relaxed">{active.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
