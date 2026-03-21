'use client'

import { Logo } from '@/components/Logo/Logo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { cn } from '@/utilities/ui'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const HeaderClient: React.FC = () => {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const SERVICES = [
    { label: t('servicesArchitecture'), href: '/services/architecture' },
    { label: t('servicesDigital'),      href: '/services/digital-design' },
    { label: t('servicesCodesign'),     href: '/services/regenerative-placemaking' },
  ]

  const NAV_LINKS = [
    { label: t('work'),     href: '/work' },
    { label: t('ventures'), href: '/ventures' },
    { label: t('about'),    href: '/about' },
    { label: t('contact'),  href: '/contact' },
  ]

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 text-sm font-semibold transition-colors hover:text-lime',
                  textColor,
                )}
                aria-expanded={servicesOpen}
              >
                {t('services')}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')} />
              </button>

              <div
                className={cn(
                  'absolute top-full left-0 pt-3 transition-all duration-150',
                  servicesOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-1',
                )}
              >
                <div className="bg-background border border-border rounded-md shadow-lg py-1 min-w-[172px]">
                  {SERVICES.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2.5 text-sm text-foreground hover:text-lime transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

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

            <div className="flex items-center gap-1">
              <LocaleSwitcher className={textColor} />
              <ThemeToggle className={textColor} />
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(true)}
            aria-label={t('openMenu')}
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
            aria-label={t('closeMenu')}
          >
            <span className="block w-6 h-0.5 bg-off-white rotate-45 translate-y-[1px]" />
            <span className="block w-6 h-0.5 bg-off-white -rotate-45" />
          </button>
        </div>
        <nav className="flex flex-col justify-center flex-1 container gap-6 pb-16 overflow-y-auto">

          {/* Services accordion */}
          <div>
            <button
              className="font-display text-5xl font-bold text-off-white hover:text-lime transition-colors flex items-center gap-3"
              onClick={() => setMobileServicesOpen((o) => !o)}
            >
              {t('services')}
              <ChevronDown className={cn('w-8 h-8 transition-transform duration-200', mobileServicesOpen && 'rotate-180')} />
            </button>
            {mobileServicesOpen && (
              <div className="mt-3 ml-1 flex flex-col gap-3">
                {SERVICES.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-2xl font-semibold text-off-white/60 hover:text-lime transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

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

          <div className="mt-4 flex items-center gap-1">
            <LocaleSwitcher className="text-off-white" />
            <ThemeToggle className="text-off-white" />
          </div>
        </nav>
      </div>
    </>
  )
}
