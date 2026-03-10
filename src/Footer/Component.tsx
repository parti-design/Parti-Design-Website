/**
 * Footer component.
 * Nav items are stored in src/content/globals/footer.yaml and read via Keystatic.
 * Falls back to a hardcoded list if the YAML file is missing.
 */
import { queryFooter } from '@/lib/keystatic-queries'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Logo } from '@/components/Logo/Logo'

// Default nav items used if the footer YAML has not been created yet
const DEFAULT_NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Ventures', href: '/ventures' },
  { label: 'Contact', href: '/contact' },
]

export async function Footer() {
  const footerData = await queryFooter()
  const navItems = footerData?.navItems ?? DEFAULT_NAV

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map((item) => (
              <Link
                className="text-white hover:text-lime transition-colors text-sm"
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
