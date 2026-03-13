import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const nextDir = path.join(rootDir, '.next')
const nextBinPath = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next')

fs.rmSync(nextDir, { recursive: true, force: true })

console.log('\nStarting local app at http://localhost:3000')
console.log('Admin: http://localhost:3000/admin\n')

if (!fs.existsSync(nextBinPath)) {
  console.error('Failed to locate Next.js. Run `pnpm install` and try again.')
  process.exit(1)
}

const child = spawn(process.execPath, [nextBinPath, 'dev'], {
  cwd: rootDir,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation',
  },
  stdio: 'inherit',
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error(`Failed to start pnpm dev: ${error.message}`)
  process.exit(1)
})
