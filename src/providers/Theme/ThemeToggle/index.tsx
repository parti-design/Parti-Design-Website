'use client'

import { Moon, Sun } from 'lucide-react'
import React from 'react'

import { useTheme } from '..'
import { cn } from '@/utilities/ui'

interface Props {
  className?: string
}

export const ThemeToggle: React.FC<Props> = ({ className }) => {
  const { theme, setTheme } = useTheme()

  const resolvedTheme = theme === 'dark' ? 'dark' : 'light'
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
        'text-current hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        className,
      )}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
