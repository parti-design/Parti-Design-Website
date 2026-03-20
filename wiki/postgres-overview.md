[← Wiki Home](./README.md)

**Dev & Deployment:** [Local Development](./local-development.md) · [Coolify Deployment](./deployment-coolify.md) · [Admin UI Plan](./admin-ui-plan.md)

---

# Postgres Overview

## What Postgres is doing in this project

Postgres is the database that stores the site's structured content and admin data.

In this repo that includes things like:

- projects
- ventures
- posts
- pages
- users
- media metadata
- globals like header/footer
- drafts / versions
- jobs metadata

The uploaded media files themselves are not stored inside Postgres. The file metadata is stored in Postgres, while the actual files live on disk / volume storage.

## How the app connects to Postgres

The connection is configured in `src/payload.config.ts` through the Payload Postgres adapter:

```ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
  },
})
```

So the connection flow is:

1. `.env` provides `DATABASE_URL`
2. `payload.config.ts` passes that value to `@payloadcms/db-postgres`
3. Payload uses that adapter to read/write data in Postgres
4. Your Next.js app talks to Payload, and Payload talks to Postgres

## What `DATABASE_URL` means

In `.env.example`, the local example is:

```env
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/parti_design_local
```

That means:

- database type: `postgresql`
- username: `postgres`
- password: `password`
- host: `127.0.0.1`
- port: `5432`
- database name: `parti_design_local`

## Local development setup

For local development, Postgres is provided by `docker-compose.yml` and is the standard supported database path:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: parti_design_local
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

This gives you a local database container with:

- username `postgres`
- password `password`
- database `parti_design_local`
- exposed on your machine at port `5432`

The named Docker volume `postgres_data` makes the data persist between container restarts.

## Mental model: what runs where

When you run local development, think of it as two separate systems:

### 1. The app

- Next.js frontend
- Payload admin
- Payload API

This runs from your repo when you start the app with `pnpm dev`.

### 2. The database

- Postgres server

This runs separately in Docker via `docker compose up`.

The app does not "contain" the database. It connects to it over the network using `DATABASE_URL`.

## How content reaches the database

You do not write SQL manually in normal development.

Instead:

1. You define collections / fields in `src/collections/*`
2. Payload turns that configuration into database structure
3. Admin actions and Local API calls read/write rows in Postgres

For example:

- `src/collections/Projects/index.ts` defines the `projects` collection
- Payload stores project rows in Postgres tables
- frontend queries call the Payload Local API
- Payload translates that into database queries

## How the frontend reads data

The frontend uses Payload's Local API in server code.

Example from `src/lib/payload-queries.ts`:

```ts
const payload = await getPayload({ config: configPromise })

const result = await payload.find({
  collection: 'projects',
  draft: false,
  overrideAccess: false,
  locale: 'en',
})
```

That means:

1. your server component / helper asks Payload for `projects`
2. Payload checks access control and collection config
3. Payload queries Postgres
4. Payload returns JS objects back to the app

So the frontend talks to Payload, not directly to Postgres.

## How the admin panel writes data

When you use `/admin`:

1. you submit a form in the Payload admin UI
2. Payload receives that request
3. Payload validates it against the collection schema
4. Payload writes the result into Postgres

Again, the browser does not talk directly to Postgres.

## Migrations

This repo tracks schema changes in `src/migrations/`.

Current migration index:

- `20260306_194129`
- `20260307_124310`
- `20260310_172907`

These are the historical changes that shaped the current database schema.

### Why migrations exist

Collection config is code, but Postgres needs actual SQL tables and columns.

Migrations are the recorded steps that tell Postgres how to move from one schema version to the next.

### Development vs production

This repo now uses the same migrations-first mindset in local development and production.

For both environments:

1. create migration files
2. commit them
3. run them against the target database

Implicit Payload dev schema push is disabled by default so local startup stays predictable and does not prompt for interactive schema reconciliation.

## Production connection

In production, `DATABASE_URL` points to your production Postgres instance instead of local Docker.

So the architecture is the same:

- app server runs Next.js + Payload
- Postgres runs separately
- app connects using `DATABASE_URL`

The only difference is the host and credentials.

## Is the local database a copy of production?

No, not by default.

In this repo, local development starts a separate Postgres container from `docker-compose.yml` and stores its data in the local Docker volume `postgres_data`.

That means:

- your local database is independent from the database hosted for production
- it is only a copy of production if you explicitly import a dump into it
- restarting the app does not sync or clone production data
- restarting the Postgres container keeps local data because the Docker volume persists it

So the normal default is:

- local app -> local Postgres
- production app -> production Postgres

They are separate databases unless you intentionally point both environments at the same `DATABASE_URL`.

## Should local development connect to the live database?

Usually no.

Connecting local development directly to the production database is risky because:

- local code may contain unfinished schema changes or migrations
- local testing can accidentally edit or delete real content
- hooks, seeds, scripts, or debug actions may run against live data
- production and local code can drift, which can cause confusing failures
- a mistake in admin or Local API code can impact the real site

The safer pattern is:

1. local development uses a local Postgres database
2. production uses its own production Postgres database
3. if you need realistic content locally, import a database dump into local Postgres
4. if the data contains sensitive information, use a sanitized dump for development

If you ever need to inspect production data directly, prefer read-only access or a one-time dump/restore workflow instead of keeping your local app permanently connected to the live database.

## Practical local workflow

Typical local flow:

1. Start Postgres:

```bash
docker compose up -d postgres
```

2. Make sure `.env` has a valid local `DATABASE_URL`

3. Run migrations:

```bash
pnpm db:migrate
```

4. Start the app:

```bash
pnpm dev
```

5. Open:

- frontend: `http://localhost:3000`
- admin: `http://localhost:3000/admin`

In normal day-to-day work, use the single bootstrap command instead:

```bash
pnpm local:start
```

## Useful debugging questions

If the app cannot reach the database, ask:

1. Is the Postgres container running?
2. Does `DATABASE_URL` match the Docker credentials?
3. Is port `5432` already in use by something else?
4. Did the schema change without a matching migration / push?
5. Am I pointing local code at the wrong database?

## Best mental model for full-stack work

For this project, think of Postgres as:

- the persistent memory of the app
- managed through Payload, not handwritten SQL
- separate from the app process
- connected through one environment variable: `DATABASE_URL`
