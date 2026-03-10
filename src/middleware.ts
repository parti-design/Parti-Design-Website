import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Paths that Payload CMS owns — bypass next-intl entirely
const PAYLOAD_PATHS = /^\/(api|admin|next)(\/.*)?$/

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  if (PAYLOAD_PATHS.test(pathname)) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
