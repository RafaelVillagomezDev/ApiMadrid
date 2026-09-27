# --- ETAPA 1: Compilación de todo el código (Builder) ---
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Instalamos Python y compiladores de C++
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copiamos SOLO package.json (npm ignora el pnpm-lock.yaml)
COPY package.json ./
# Usamos --legacy-peer-deps por seguridad para evitar conflictos de versiones
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


# --- ETAPA 2: Solo dependencias de producción ---
FROM node:22-bookworm-slim AS prod-deps
WORKDIR /app

# Volvemos a instalar los compiladores para este paso temporal
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json ./
# Instalamos SOLO las dependencias limpias de producción
RUN npm install --omit=dev --legacy-peer-deps


# --- ETAPA 3: Imagen Final (Súper ligera) ---
FROM node:22-bookworm-slim
WORKDIR /app

COPY package.json ./

# Copiamos las dependencias ya compiladas desde la Etapa 2
COPY --from=prod-deps /app/node_modules ./node_modules
# Copiamos tu código compilado desde la Etapa 1
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Arrancamos la API usando npm nativo
CMD ["npm", "run", "production"]