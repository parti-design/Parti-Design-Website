/**
 * Keystatic admin UI page component.
 * Uses makePage() from @keystatic/next/ui/app to create the admin app component.
 * Must be a client component.
 */
'use client'

import { makePage } from '@keystatic/next/ui/app'
import keystaticConfig from '../../../keystatic.config'

export const KeystaticApp = makePage(keystaticConfig)
