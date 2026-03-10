'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/ui'

interface Props {
  className?: string
}

export function LocaleSwitcher({ className }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <div className={cn('flex items-center gap-1 text-xs font-semibold', className)}>
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'px-1.5 py-0.5 rounded transition-colors text-current',
          locale === 'en' ? 'text-lime opacity-100' : 'opacity-60 hover:opacity-100',
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="opacity-40">/</span>
      <button
        onClick={() => switchLocale('sv')}
        className={cn(
          'px-1.5 py-0.5 rounded transition-colors text-current',
          locale === 'sv' ? 'text-lime opacity-100' : 'opacity-60 hover:opacity-100',
        )}
        aria-label="Byt till svenska"
      >
        SV
      </button>
    </div>
  )
}
