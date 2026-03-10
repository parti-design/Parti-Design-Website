/**
 * LowImpactHero — simplified version that no longer depends on Payload Page type.
 */
import React from 'react'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | {
      children?: never
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      richText?: any
    }

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
