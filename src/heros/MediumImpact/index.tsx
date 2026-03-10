/**
 * MediumImpactHero — simplified version that no longer depends on Payload Page type.
 */
import React from 'react'

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

interface MediumImpactHeroProps {
  links?: HeroLink[] | null
  media?: string | { url?: string; mimeType?: string; caption?: unknown } | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText?: any
}

export const MediumImpactHero: React.FC<MediumImpactHeroProps> = ({ links, media, richText }) => {
  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
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
      <div className="container ">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media}
            />
          </div>
        )}
      </div>
    </div>
  )
}
