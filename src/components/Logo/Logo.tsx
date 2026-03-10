import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/branding/parti-design-logo.svg"
      alt="Parti Design"
      className={className}
      style={{ height: '44px', width: '44px', objectFit: 'contain' }}
    />
  )
}
