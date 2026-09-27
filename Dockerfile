# --- ETAPA 1: Compilación de todo el código (Builder) ---
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Instalamos Python y compiladores de C++
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm rebuild bcrypt sharp

COPY . .
RUN pnpm run build


# --- ETAPA 2: Solo dependencias de producción ---
FROM node:22-bookworm-slim AS prod-deps
WORKDIR /app

# Volvemos a instalar los compiladores solo para este paso temporal
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
RUN pnpm rebuild bcrypt sharp


# --- ETAPA 3: Imagen Final (Súper ligera y sin basura de compilación) ---
FROM node:22-bookworm-slim
WORKDIR /app

RUN npm install -g pnpm
COPY package.json ./

# Copiamos las dependencias ya compiladas desde la Etapa 2
COPY --from=prod-deps /app/node_modules ./node_modules
# Copiamos tu código compilado desde la Etapa 1
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["pnpm", "run", "production"]