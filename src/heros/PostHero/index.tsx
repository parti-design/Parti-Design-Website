/**
 * PostHero — simplified version that no longer depends on Payload Post type.
 * The posts/[slug]/page.tsx now renders its own hero inline; this is a fallback.
 */
import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

interface PostHeroProps {
  title?: string
  heroImage?: string | null
  categories?: string[] | null
  authors?: string[] | null
  publishedAt?: string | null
}

export const PostHero: React.FC<{
  post: PostHeroProps
}> = ({ post }) => {
  const { categories, heroImage, authors, publishedAt, title } = post

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {categories && categories.length > 0 && (
            <div className="uppercase text-sm mb-6">
              {categories.join(', ')}
            </div>
          )}

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {authors && authors.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Author</p>
                <p>{authors.join(', ')}</p>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={title ?? ''}
            className="-z-10 object-cover absolute inset-0 w-full h-full"
          />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
