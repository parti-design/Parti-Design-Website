import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Paths that bypass next-intl locale routing entirely
const BYPASS_PATHS = /^\/(api|keystatic)(\/.*)?$/

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  if (BYPASS_PATHS.test(pathname)) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
