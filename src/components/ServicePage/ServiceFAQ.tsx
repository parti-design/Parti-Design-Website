'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface Props {
  items: FAQItem[]
}

export function ServiceFAQ({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left group"
            aria-expanded={open === i}
          >
            <span className="text-base font-semibold text-foreground group-hover:text-lime transition-colors">
              {item.question}
            </span>
            <span
              className="shrink-0 text-muted-foreground text-xl leading-none transition-transform duration-200"
              style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
              aria-hidden
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="pb-5 text-base text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
