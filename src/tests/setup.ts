import { vi, beforeEach } from 'vitest';

// 1. Definimos los mocks de las funciones de la base de datos
const mockQuery = vi.fn();
const mockExecute = vi.fn();

// 2. Mockeamos el módulo de conexión
vi.mock('../connection/bd', () => {
  return {
    pool: {
      // Simulamos la función .promise() que devuelve los métodos asíncronos
      promise: vi.fn(() => ({
        query: mockQuery,
        execute: mockExecute,
      })),
      // También mockeamos la versión normal por si acaso
      query: vi.fn(),
      execute: vi.fn(),
      end: vi.fn().mockResolvedValue(undefined),
    },
  };
});

// 3. Importamos el pool para poder acceder a los mocks en los tests
import { pool } from '../connection/bd';

beforeEach(() => {
  // Limpiamos el historial de consultas antes de cada test
  vi.clearAllMocks();
  
  // Opcional: Configurar un valor de retorno por defecto (vacío)
  // para que no falle si olvidas configurar un test específico
  const promisePool = pool.promise();
  (promisePool.query as any).mockResolvedValue([[], []]);
  (promisePool.execute as any).mockResolvedValue([[], []]);
});