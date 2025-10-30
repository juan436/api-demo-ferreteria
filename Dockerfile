# ====== Builder stage ======
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ====== Runtime stage ======
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/logo.jpeg ./logo.jpeg

EXPOSE 3001
CMD ["node", "dist/main.js"]