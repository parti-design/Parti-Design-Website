import { spawnSync } from 'node:child_process'

import dotenv from 'dotenv'

dotenv.config()

const databaseURL = process.env.DATABASE_URL

if (!databaseURL) {
  console.error('DATABASE_URL is required in `.env` before running local migrations.')
  process.exit(1)
}

const parsed = new URL(databaseURL)
const databaseName = parsed.pathname.replace(/^\//, '')

if (!databaseName) {
  console.error('DATABASE_URL must include a database name.')
  process.exit(1)
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: ['pipe', 'inherit', 'inherit'],
    encoding: 'utf8',
    ...options,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  return result
}

const psql = (query) => {
  const result = spawnSync(
    'docker',
    ['compose', 'exec', '-T', 'postgres', 'psql', '-U', 'postgres', '-d', databaseName, '-Atqc', query],
    {
      stdio: ['ignore', 'pipe', 'inherit'],
      encoding: 'utf8',
    },
  )

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  return result.stdout.trim()
}

const publicTableCount = Number(
  psql("select count(*) from information_schema.tables where table_schema = 'public';"),
)

const hasMigrationsTable = psql(
  "select case when to_regclass('public.payload_migrations') is null then '0' else '1' end;",
) === '1'

if (publicTableCount === 0) {
  console.log('Local database is empty. Bootstrapping schema from committed migrations.')
  run('pnpm', ['payload', 'migrate:fresh'], { input: 'y\n' })
  process.exit(0)
}

if (hasMigrationsTable) {
  run('pnpm', ['payload', 'migrate'])
  process.exit(0)
}

console.error(
  'Local database contains tables but has no payload_migrations history. Refusing automatic migration because the schema is ambiguous. Run `pnpm local:reset --yes` to recreate the local Docker database, or inspect the database manually before proceeding.',
)
process.exit(1)
