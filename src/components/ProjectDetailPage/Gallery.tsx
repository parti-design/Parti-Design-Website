'use client'

import React, { useCallback, useEffect, useState } from 'react'

interface GalleryImage {
  src: string
  fullSrc?: string
  caption?: string
}

interface Props {
  images: GalleryImage[]
  projectTitle: string
  labels: {
    viewImage: string
    close: string
    previousImage: string
    nextImage: string
    imageLabel: string
    of: string
  }
}

export function Gallery({ images, projectTitle, labels }: Props) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])

  const prev = useCallback(
    () => setActive((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length],
  )

  const next = useCallback(
    () => setActive((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length],
  )

  useEffect(() => {
    if (active === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, close, prev, next])

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map(({ src, caption }, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className="w-full group cursor-zoom-in relative overflow-hidden rounded-md"
            aria-label={`${labels.viewImage} ${i + 1} ${labels.of} ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={caption ?? ''}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300 rounded-md" />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(35,31,32,0.97)' }}
          onClick={close}
          role="dialog"
          aria-modal
          aria-label={`${projectTitle} — ${labels.imageLabel} ${active + 1} ${labels.of} ${images.length}`}
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-off-white/60 hover:text-off-white transition-colors text-2xl leading-none"
            aria-label={labels.close}
          >
            ✕
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-off-white/40 text-xs tracking-widest uppercase font-medium">
            {active + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-off-white/50 hover:text-off-white transition-colors rounded-full hover:bg-off-white/10"
              aria-label={labels.previousImage}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-off-white/50 hover:text-off-white transition-colors rounded-full hover:bg-off-white/10"
              aria-label={labels.nextImage}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-[90vw] max-h-[88vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active].fullSrc ?? images[active].src}
              alt={images[active].caption ?? `${projectTitle} — ${labels.imageLabel} ${active + 1}`}
              className="max-h-[88vh] max-w-[90vw] object-contain rounded-sm shadow-2xl"
            />
            {images[active].caption && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-off-white/60 text-xs text-center max-w-sm">
                {images[active].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
