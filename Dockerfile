# Etapa 1: Construcción (Build)
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

# Copiamos los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# 🔥 SOLUCIÓN: Permitimos explícitamente compilar bcrypt y sharp
RUN echo 'onlyBuiltDependencies=["bcrypt", "sharp"]' > .npmrc

# Instalamos TODAS las dependencias usando el lockfile para consistencia
RUN pnpm install --frozen-lockfile

# Copiamos todo el código fuente
COPY . .

# Compilamos el código TypeScript a JavaScript (crea la carpeta dist)
RUN pnpm run build

# Etapa 2: Producción (Imagen final ligera)
FROM node:22-bookworm-slim

WORKDIR /app

# Instalamos pnpm en la imagen final
RUN npm install -g pnpm

# Copiamos solo los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# 🔥 SOLUCIÓN: Repetimos el permiso para la etapa de producción
RUN echo 'onlyBuiltDependencies=["bcrypt", "sharp"]' > .npmrc

# Instalamos SOLO las dependencias de producción (omite las de desarrollo)
RUN pnpm install --prod --frozen-lockfile

# Copiamos la carpeta compilada desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponemos el puerto que usa Express
EXPOSE 3000

# Arrancamos usando tu script de producción
CMD ["pnpm", "run", "production"]