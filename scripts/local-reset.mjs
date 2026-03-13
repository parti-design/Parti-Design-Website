import { spawnSync } from 'node:child_process'

const hasYesFlag = process.argv.includes('--yes')

if (!hasYesFlag) {
  console.error('`pnpm local:reset --yes` is required because this will destroy the local Docker database volume.')
  process.exit(1)
}

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run('docker', ['compose', 'down', '-v'])
run('pnpm', ['db:start'])
run('pnpm', ['db:wait'])
run('pnpm', ['db:migrate'])
