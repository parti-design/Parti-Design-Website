# Local Development

## Standard workflow

This repo supports one routine local-development path:

- Next.js + Payload run natively on the host
- Postgres runs in Docker
- local schema updates are applied through committed migrations
- the local database gets basic project and venture layout data during `pnpm local:start`

## Required toolchain

- Node `20.20.1`
- Corepack enabled so the pinned pnpm version can be used
- Docker with `docker compose`

The repo pins:

- `.nvmrc` -> `20.20.1`
- `packageManager` -> `pnpm@10.32.1`

## Local bootstrap

1. Copy `.env.example` to `.env`
2. Run `pnpm install`
3. Run `pnpm local:start`

`pnpm local:start` is the authoritative local entrypoint. It:

1. checks the local environment
2. starts the Docker Postgres container
3. waits for Postgres to become healthy
4. runs committed migrations
5. ensures the basic `projects` and `ventures` layout seed exists
6. clears stale `.next` dev artifacts
7. prints the local app and admin URLs
8. starts the app

## Local database contract

The standard local database URL is:

```env
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/parti_design_local
```

Local bootstrap only allows these database hosts by default:

- `127.0.0.1`
- `localhost`
- `postgres`

If you intentionally need to bypass that guard, set:

```env
LOCAL_DEV_ALLOW_REMOTE_DATABASE=true
```

That override should be rare. The normal policy is local app -> local Docker Postgres.

## Commands

- `pnpm local:doctor` checks Node, pnpm, Docker, `.env`, and local DB safety
- `pnpm local:start` starts the standard local environment
- `pnpm local:stop` stops the local app server for this repo
- `pnpm local:seed:layout` ensures the basic `projects` and `ventures` layout seed exists
- `pnpm db:start` starts Docker Postgres
- `pnpm db:stop` stops Docker Postgres
- `pnpm db:logs` tails Postgres logs
- `pnpm db:wait` waits for Postgres health
- `pnpm db:migrate` runs committed Payload migrations
- `pnpm local:reset --yes` destroys and recreates the local Docker database
- `pnpm local:seed:demo --yes` replaces local content with the demo seed

`pnpm local:start` expects port `3000` to be free. If another app or an old Next dev process is already using it, the preflight will stop and tell you to shut that process down first.

## Schema policy

This repo uses a migrations-first workflow by default.

- create a migration after schema changes with `pnpm payload migrate:create`
- apply it locally with `pnpm db:migrate`
- commit the migration alongside the schema change

Implicit Payload dev schema push is disabled by default so startup stays predictable and does not fall into interactive schema reconciliation prompts.

For disposable scratch databases only, you can opt into schema push with:

```env
PAYLOAD_ENABLE_DEV_SCHEMA_PUSH=true
```

That is an escape hatch, not the team default.

## Seed policy

The default first-run experience is:

- an empty migrated schema
- plus an automatic idempotent layout seed for `projects` and `ventures`

That layout seed is safe to run on every `pnpm local:start` because it skips records that already exist by slug. It does not seed media files.

Use the demo seed only when you explicitly want broader sample Payload content. It is destructive and will replace current local content.

Project-specific content import workflows should stay separate from the demo seed path.

## Troubleshooting

### `SyntaxError: Unexpected non-whitespace character after JSON ...`

If local pages suddenly start failing with a stack trace that mentions `loadManifest` and `.next/prerender-manifest.json`, the problem is generated Next.js dev state, not Postgres content.

Expected recovery:

1. Stop the current dev server
2. Run `pnpm local:start` again

The standard bootstrap clears `.next` before starting Next.js, so a clean restart should regenerate the manifest correctly.

If the error persists, check these first:

- port `3000` is not already occupied by an old Next.js process
- you are using the pinned Node 20 toolchain
- the restart is happening from the repo root with `pnpm local:start`
