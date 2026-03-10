/**
 * HighImpactHero — simplified version that no longer depends on Payload Page type.
 * Previously used Page['hero'] from payload-types.
 */
'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

interface HeroLink {
  link: {
    type?: 'custom' | 'reference' | null
    url?: string | null
    label?: string | null
    newTab?: boolean | null
    appearance?: string
  }
}

interface HighImpactHeroProps {
  links?: HeroLink[] | null
  media?: string | { url?: string; mimeType?: string } | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText?: any
}

export const HighImpactHero: React.FC<HighImpactHeroProps> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
