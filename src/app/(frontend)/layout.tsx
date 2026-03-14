import type { Metadata } from 'next'

import { AdminBar } from '@/components/AdminBar'
import { routing } from '@/i18n/routing'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { GeistMono } from 'geist/font/mono'
import { Expletus_Sans, Mulish } from 'next/font/google'
import React from 'react'

import './globals.css'

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const expletusSans = Expletus_Sans({
  subsets: ['latin'],
  variable: '--font-expletus-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(mulish.variable, expletusSans.variable, GeistMono.variable)}
      lang={routing.defaultLocale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar />

          {children}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
