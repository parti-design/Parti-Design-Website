import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import dotenv from 'dotenv'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const envPath = path.join(rootDir, '.env')
const allowedHosts = new Set(['127.0.0.1', 'localhost', 'postgres'])
const allowRemoteDatabase = process.env.LOCAL_DEV_ALLOW_REMOTE_DATABASE === 'true'

const errors = []

const fail = () => {
  console.error('\nLocal development environment check failed:\n')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: rootDir, encoding: 'utf8' })

  return {
    ok: result.status === 0,
    stdout: result.stdout?.trim(),
    stderr: result.stderr?.trim(),
  }
}

const nodeMajor = Number(process.versions.node.split('.')[0])
if (nodeMajor !== 20) {
  errors.push(
    `Node ${process.versions.node} detected. Use Node 20.20.1 from .nvmrc before running local commands.`,
  )
}

const pnpmCheck = run('pnpm', ['--version'])
if (!pnpmCheck.ok) {
  errors.push('pnpm is not available. Run `corepack enable` and try again.')
}

const dockerCheck = run('docker', ['--version'])
if (!dockerCheck.ok) {
  errors.push('Docker is not available. Install Docker Desktop or Docker Engine and try again.')
} else {
  const dockerDaemonCheck = run('docker', ['info'])
  if (!dockerDaemonCheck.ok) {
    errors.push(
      'Docker is installed but the Docker daemon is not reachable. Start Docker and try again.',
    )
  }

  const dockerComposeCheck = run('docker', ['compose', 'version'])
  if (!dockerComposeCheck.ok) {
    errors.push('`docker compose` is not available. Install Docker with Compose v2 support.')
  }
}

if (!fs.existsSync(envPath)) {
  errors.push('`.env` is missing. Copy `.env.example` to `.env` before starting local development.')
}

if (fs.existsSync(envPath)) {
  const env = dotenv.parse(fs.readFileSync(envPath))
  const databaseURL = env.DATABASE_URL

  if (!databaseURL) {
    errors.push('`DATABASE_URL` is missing from `.env`.')
  } else {
    try {
      const parsed = new URL(databaseURL)
      if (!allowRemoteDatabase && !allowedHosts.has(parsed.hostname)) {
        errors.push(
          `DATABASE_URL host "${parsed.hostname}" is not allowed for local bootstrap. Use 127.0.0.1, localhost, or postgres. To override intentionally, set LOCAL_DEV_ALLOW_REMOTE_DATABASE=true.`,
        )
      }
    } catch {
      errors.push('`DATABASE_URL` in `.env` is not a valid URL.')
    }
  }
}

const portCheck = run('lsof', ['-iTCP:5432', '-sTCP:LISTEN', '-n', '-P'])
if (portCheck.ok && portCheck.stdout.includes('postgres')) {
  errors.push(
    'A native Postgres server is already listening on port 5432. Stop it before using the Docker Postgres workflow.',
  )
}

const appPortCheck = run('lsof', ['-iTCP:3000', '-sTCP:LISTEN', '-n', '-P'])
if (appPortCheck.ok && appPortCheck.stdout.length > 0) {
  errors.push(
    'Port 3000 is already in use. Stop the existing app process before running `pnpm local:start` again.',
  )
}

if (errors.length > 0) {
  fail()
}

console.log('Local development environment looks ready.')
