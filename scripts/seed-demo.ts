import 'dotenv/config'

import { createLocalReq, getPayload } from 'payload'

import config from '../src/payload.config'
import { seed } from '../src/endpoints/seed'

const hasYesFlag = process.argv.includes('--yes')
const databaseURL = process.env.DATABASE_URL
const allowRemoteDatabase = process.env.LOCAL_DEV_ALLOW_REMOTE_DATABASE === 'true'
const allowedHosts = new Set(['127.0.0.1', 'localhost', 'postgres'])

if (!hasYesFlag) {
  console.error(
    '`pnpm local:seed:demo --yes` is required because the demo seed clears existing local content before recreating it.',
  )
  process.exit(1)
}

if (!databaseURL) {
  console.error('DATABASE_URL is required in `.env` before running the demo seed.')
  process.exit(1)
}

const parsedDatabaseURL = new URL(databaseURL)

if (!allowRemoteDatabase && !allowedHosts.has(parsedDatabaseURL.hostname)) {
  console.error(
    `Refusing to seed database host "${parsedDatabaseURL.hostname}". Set LOCAL_DEV_ALLOW_REMOTE_DATABASE=true only if this is intentional.`,
  )
  process.exit(1)
}

const payload = await getPayload({ config })

try {
  const req = await createLocalReq({}, payload)
  await seed({ payload, req })
  console.log('Demo content seed complete.')
} finally {
  await payload.destroy()
}
