/**
 * Keystatic API route handler (Next.js App Router).
 * Handles all /api/keystatic/* requests — used by the admin UI to read and
 * write content files, and to authenticate with GitHub OAuth in production.
 *
 * Uses `makeRouteHandler` from '@keystatic/next/route-handler' which returns
 * { GET, POST } compatible with Next.js App Router route handlers.
 */
import { makeRouteHandler } from '@keystatic/next/route-handler'
import keystaticConfig from '../../../../../keystatic.config'

export const { GET, POST } = makeRouteHandler({ config: keystaticConfig })
