/**
 * RelatedPosts block — simplified version that no longer depends on Payload Post type.
 * Uses the minimal CardPostData interface from the Card component.
 */
import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import { Card, type CardPostData } from '../../components/Card'

export type RelatedPostsProps = {
  className?: string
  docs?: CardPostData[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  introContent?: any
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
