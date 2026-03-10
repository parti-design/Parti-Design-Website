/**
 * MediaBlock — simplified version that no longer depends on Payload MediaBlock type.
 */
import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import { Media } from '../../components/Media'

interface MediaBlockProps {
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  /** Media can be a string path (Keystatic) or an object with url/mimeType (legacy Payload) */
  media?: string | { url?: string; mimeType?: string; caption?: unknown } | null
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<MediaBlockProps> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let caption: any
  if (media && typeof media === 'object') caption = (media as { caption?: unknown }).caption

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <Media
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          {typeof caption === 'string' ? (
            <p className="text-sm text-muted-foreground">{caption}</p>
          ) : (
            <RichText data={caption} enableGutter={false} />
          )}
        </div>
      )}
    </div>
  )
}
