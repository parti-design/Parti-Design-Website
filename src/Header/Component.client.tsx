'use client'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Ventures', href: '/ventures' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export const HeaderClient: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // On non-home pages, always show filled header
  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const textColor = scrolled ? 'text-foreground' : 'text-off-white'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-border'
            : 'bg-transparent',
        )}
      >
        <div className="container py-5 flex justify-between items-center">
          <Link href="/" className={cn('transition-colors', textColor)}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-semibold transition-colors hover:text-lime',
                  textColor,
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className={cn('block w-6 h-0.5 transition-colors', scrolled ? 'bg-foreground' : 'bg-off-white')} />
            <span className={cn('block w-6 h-0.5 transition-colors', scrolled ? 'bg-foreground' : 'bg-off-white')} />
            <span className={cn('block w-6 h-0.5 transition-colors', scrolled ? 'bg-foreground' : 'bg-off-white')} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-ink flex flex-col transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <div className="container py-5 flex justify-between items-center">
          <Link href="/" className="text-off-white" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>
          <button
            className="flex flex-col gap-0 p-2"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <span className="block w-6 h-0.5 bg-off-white rotate-45 translate-y-[1px]" />
            <span className="block w-6 h-0.5 bg-off-white -rotate-45" />
          </button>
        </div>
        <nav className="flex flex-col justify-center flex-1 container gap-6 pb-16">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-5xl font-bold text-off-white hover:text-lime transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
