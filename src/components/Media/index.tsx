/**
 * Media component.
 *
 * Updated to accept both Keystatic and legacy Payload resource shapes:
 *   - Keystatic stores image paths as plain strings (e.g. "/media/image.jpg")
 *   - Payload returned objects with { url, width, height, mimeType, alt }
 *
 * If `resource` is a string, it renders a simple <img> or <video> tag.
 * If `resource` is an object (legacy Payload shape), the existing ImageMedia/VideoMedia logic runs.
 */
import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  // Keystatic passes image paths as strings — detect video by extension
  if (typeof resource === 'string') {
    const isVideoStr = /\.(mp4|webm|ogg|mov)$/i.test(resource)
    const Tag = htmlElement || Fragment

    return (
      <Tag
        {...(htmlElement !== null ? { className } : {})}
      >
        {isVideoStr ? (
          <video
            autoPlay
            controls={false}
            loop
            muted
            playsInline
            className={props.videoClassName}
            onClick={props.onClick}
          >
            <source src={resource} />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource}
            alt={props.alt ?? ''}
            className={props.imgClassName}
            loading={props.loading ?? 'lazy'}
            onClick={props.onClick}
          />
        )}
      </Tag>
    )
  }

  // Legacy Payload object shape
  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
