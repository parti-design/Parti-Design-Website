/**
 * Media component types.
 *
 * Updated to remove the Payload CMS type dependency.
 * `resource` now accepts:
 *   - A plain string path (Keystatic stores image paths as strings, e.g. "/media/image.jpg")
 *   - An object with url, width, height, alt fields (backwards-compatible Payload shape)
 *   - A number (legacy Payload relation ID — treated as missing)
 *   - null/undefined
 */
import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

/** Minimal shape of a media resource object (matches what Payload used to return) */
export interface MediaResource {
  url?: string | null
  filename?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  updatedAt?: string | null
}

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  pictureClassName?: string
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  /** Accepts a string path, a media resource object, a legacy numeric ID, or null */
  resource?: MediaResource | string | number | null
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
}
