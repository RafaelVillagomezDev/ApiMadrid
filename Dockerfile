# Etapa 1: Construcción (Build)
FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# 🔥 1. Instalamos bloqueando los scripts automáticos para evitar el error
RUN pnpm install --frozen-lockfile --ignore-scripts

# 🔥 2. Forzamos la compilación manual de las librerías nativas
RUN pnpm rebuild bcrypt sharp

COPY . .
RUN pnpm run build

# Etapa 2: Producción (Imagen final ligera)
FROM node:22-bookworm-slim

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# 🔥 3. Hacemos exactamente lo mismo para la imagen de producción
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
RUN pnpm rebuild bcrypt sharp

COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["pnpm", "run", "production"]