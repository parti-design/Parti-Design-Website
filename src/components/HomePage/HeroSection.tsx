'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

const HEADLINE_WORDS = ['New', 'ways', 'to', 'organize', 'and', 'build', 'together.']

export function HeroSection() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="min-h-screen flex items-center relative bg-ink overflow-hidden">
      {/* Hero background photo — oversized vertically so parallax never shows a gap */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/assets/hero/DSC09791-by%20Sofia%20Mor%C3%A9n.jpg"
        alt=""
        aria-hidden
        className="absolute left-0 right-0 w-full object-cover object-center"
        style={{ top: '-10%', height: '120%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/65 to-ink/40" />

      <div className="container relative z-10 py-32 lg:py-40 grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-8">
          {/* Headline with word-by-word stagger */}
          <h1 className="font-display text-6xl md:text-7xl xl:text-8xl font-bold text-off-white leading-[1.0]">
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.2em] opacity-0"
                style={{
                  animation: 'fadeWordIn 0.5s ease forwards',
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Sub-statement */}
          <p
            className="text-lg md:text-xl text-off-white/75 max-w-xl leading-relaxed opacity-0"
            style={{
              animation: 'fadeWordIn 0.55s ease forwards',
              animationDelay: `${HEADLINE_WORDS.length * 0.07 + 0.1}s`,
            }}
          >
            Parti Design is a multidisciplinary architecture and design studio. We develop
            regenerative places through digital, physical and social systems.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 opacity-0"
            style={{
              animation: 'fadeWordIn 0.55s ease forwards',
              animationDelay: `${HEADLINE_WORDS.length * 0.07 + 0.3}s`,
            }}
          >
            <Link
              href="#work"
              className="inline-flex items-center px-6 py-3 rounded-md bg-lime text-ink font-semibold text-sm hover:bg-lime/90 transition-colors"
            >
              See our work
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-md border border-off-white/60 text-off-white font-semibold text-sm hover:bg-off-white hover:text-ink transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator — bouncing chevron */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-0"
        style={{
          animation: 'fadeWordIn 0.5s ease forwards',
          animationDelay: `${HEADLINE_WORDS.length * 0.07 + 1.0}s`,
        }}
      >
        <span className="text-off-white/50 text-[10px] tracking-[0.2em] uppercase font-medium">
          Scroll
        </span>
        <div className="animate-bounce mt-1">
          <div className="w-5 h-5 border-r-2 border-b-2 border-off-white/40 rotate-45" />
        </div>
      </div>
    </section>
  )
}
