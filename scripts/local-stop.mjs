import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const psResult = spawnSync('ps', ['ax', '-o', 'pid=,command='], {
  cwd: rootDir,
  encoding: 'utf8',
})

if (psResult.status !== 0) {
  console.error('Failed to inspect running processes.')
  process.exit(1)
}

const patterns = [
  `${rootDir}/node_modules/.bin/../next/dist/bin/next dev`,
  `${rootDir}/scripts/start-local-dev.mjs`,
  `${rootDir}.*local:start`,
]

const matches = psResult.stdout
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const firstSpace = line.indexOf(' ')
    return {
      pid: Number(line.slice(0, firstSpace)),
      command: line.slice(firstSpace + 1),
    }
  })
  .filter(({ pid, command }) => {
    if (!Number.isInteger(pid) || pid === process.pid) return false
    return patterns.some((pattern) => {
      if (pattern.includes('.*')) {
        const [prefix, suffix] = pattern.split('.*')
        return command.includes(prefix) && command.includes(suffix)
      }
      return command.includes(pattern)
    })
  })

if (matches.length === 0) {
  console.log('No local app processes were running for this repo.')
  process.exit(0)
}

for (const match of matches) {
  try {
    process.kill(match.pid, 'SIGTERM')
    console.log(`Stopped PID ${match.pid}: ${match.command}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Failed to stop PID ${match.pid}: ${message}`)
    process.exitCode = 1
  }
}

console.log('Local app stop complete. The Docker database is still running.')
