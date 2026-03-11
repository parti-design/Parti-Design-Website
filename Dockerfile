FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
# PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD prevents the ~300MB chromium binary from being
# downloaded during install — it is only needed for local testing, not production.
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# src/content/ is needed at runtime — Keystatic reads MDX/YAML files
# directly from the filesystem to serve page data
COPY --from=builder /app/src ./src

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# No database migrations needed — content lives in src/content/ as files
CMD ["node_modules/.bin/next", "start"]
