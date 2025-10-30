# ====== Builder stage ======
FROM node:20-alpine AS builder
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm ci

# Copia el resto de los archivos
COPY . .
RUN npm run build

# ====== Runtime stage ======
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --omit=dev

# Copia los archivos compilados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/logo.png ./logo.png

EXPOSE 3001
CMD ["node", "dist/main.js"]