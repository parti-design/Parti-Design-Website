import { execFileSync } from 'node:child_process'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const timeoutMs = 60_000
const intervalMs = 2_000
const startedAt = Date.now()

const getContainerId = () => {
  try {
    return execFileSync('docker', ['compose', 'ps', '-q', 'postgres'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

const getHealth = (containerId) => {
  try {
    return execFileSync(
      'docker',
      [
        'inspect',
        '--format',
        '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}',
        containerId,
      ],
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    ).trim()
  } catch {
    return ''
  }
}

while (Date.now() - startedAt < timeoutMs) {
  const containerId = getContainerId()

  if (containerId) {
    const health = getHealth(containerId)
    if (health === 'healthy') {
      console.log('Postgres is healthy.')
      process.exit(0)
    }
  }

  await sleep(intervalMs)
}

console.error('Timed out waiting for the postgres Docker container to become healthy.')
process.exit(1)
