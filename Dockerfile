FROM node:20-alpine AS builder
WORKDIR /app

ENV PNPM_VERSION=9.1.2 \
    PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN corepack enable && \
    corepack prepare pnpm@${PNPM_VERSION} --activate

RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set store-dir /pnpm-store && \
    pnpm config set strict-peer-dependencies true && \
    pnpm config set ignore-scripts true && \
    pnpm fetch && \
    pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm config set ignore-scripts false && \
    pnpm rebuild bcrypt && \
    pnpm config set ignore-scripts true

COPY . .
RUN pnpm run build

RUN pnpm prune --prod

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001\
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -H -G nodejs appuser

COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package.json ./

RUN chown -R appuser:nodejs /app && \
    find /app -type f -exec chmod 644 {} \; && \
    find /app -type d -exec chmod 755 {} \; && \
    chmod 755 /app/dist/main.js 2>/dev/null || true

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -q --tries=1 --spider http://localhost:3001/api/health || exit 1

USER appuser
EXPOSE 3001
CMD ["node", "dist/main.js"]