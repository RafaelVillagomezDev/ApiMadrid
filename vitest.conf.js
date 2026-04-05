import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 1. Habilita 'describe', 'it', 'expect' globalmente
    globals: true,
    
    // 2. Entorno Node para Express y MySQL
    environment: 'node',
    
    // 3. Ruta a tu archivo de setup que creamos antes
    setupFiles: ['./src/tests/setup.ts'],
    
    // 4. Patrón de búsqueda para tus carpetas __tests__
    // Esto buscará cualquier archivo .test.ts o .spec.ts dentro de carpetas __tests__
    include: ['**/__tests__/**/*.{test,spec}.{ts,js}'],
    
    // 5. Cobertura (opcional pero recomendado)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/tests/setup.ts'],
    },
    
    // 6. Alias (opcional): Te ayuda a evitar los ../../../
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});