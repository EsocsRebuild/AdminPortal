# syntax=docker/dockerfile:1.10
#
# ESOCS Admin portal: production image.
#
#   docker build \
#     --build-arg NEXT_PUBLIC_APP_URL=https://admin.esocs.org \
#     --build-arg DEPLOYMENT_VERSION=$(git rev-parse --short HEAD) \
#     --secret id=actions_key,env=NEXT_SERVER_ACTIONS_ENCRYPTION_KEY \
#     -t esocs-admin .
#
# Stages: deps (install) → builder (next build, standalone) → runner (minimal, non-root).

ARG NODE_VERSION=24

# ─── Base ────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ─── Dependencies (cached until the lockfile changes) ────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund

# ─── Build ───────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public values are inlined into the browser bundle at build time.
ARG NEXT_PUBLIC_APP_URL=http://localhost:3001
ARG NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES=15
ARG DEPLOYMENT_VERSION=dev
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES=${NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES} \
    DEPLOYMENT_VERSION=${DEPLOYMENT_VERSION} \
    NODE_ENV=production \
    # Every page renders per request, so the build never calls the API. This
    # placeholder only satisfies env validation; the real URL is set at runtime.
    BACKEND_API_URL=http://build.invalid

# The Server Actions key is a BuildKit secret: embedded in the build output,
# never stored in image layers or history. Optional (a random key is used if absent).
RUN --mount=type=secret,id=actions_key,env=NEXT_SERVER_ACTIONS_ENCRYPTION_KEY,required=false \
    npm run build

# ─── Runtime ─────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ARG DEPLOYMENT_VERSION=dev
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DEPLOYMENT_VERSION=${DEPLOYMENT_VERSION}

LABEL org.opencontainers.image.title="esocs-admin" \
      org.opencontainers.image.description="ESOCS administration portal" \
      org.opencontainers.image.version="${DEPLOYMENT_VERSION}"

RUN addgroup -S -g 1001 nodejs && adduser -S -D -H -u 1001 -G nodejs nextjs \
    # Drop tooling an attacker could use; the server needs only node.
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn* /usr/local/bin/yarn*

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# Node receives SIGTERM directly (exec form) for graceful shutdown.
CMD ["node", "server.js"]
