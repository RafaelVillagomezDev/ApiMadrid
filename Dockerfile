# Etapa 1: Construcción (Build)
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies para poder compilar TypeScript)
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Compilamos el código TypeScript a JavaScript (crea la carpeta dist)
RUN npm run build

# Etapa 2: Producción (Imagen final ligera)
FROM node:22-bookworm-slim

WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# Instalamos SOLO las dependencias de producción (omite devDependencies, ahorrando mucho espacio)
RUN npm install --omit=dev

# Copiamos la carpeta compilada desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Si tienes archivos estáticos o vistas que no son TS, descomenta la siguiente línea y ajusta la ruta
# COPY --from=builder /app/public ./public

# Exponemos el puerto que usa Express
EXPOSE 3000

# Arrancamos usando tu script de producción
CMD ["npm", "run", "production"]