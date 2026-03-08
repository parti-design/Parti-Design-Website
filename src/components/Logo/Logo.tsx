import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = ({ className }: Props) => {
  return (
    <span
      className={clsx(
        'font-display font-bold text-xl tracking-tight leading-none',
        className,
      )}
    >
      Parti Design
    </span>
  )
}
