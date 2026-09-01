import { checkSchema,checkExact } from 'express-validator';
import { pool } from '../connection/bd';
import { isRestaurant } from '../queries/restaurant-query';

const promisePool = pool.promise();

const RestaurantSchema = {
  create: checkSchema({
    address: {
      in: ['body'],
      errorMessage: 'Dirección inválida',
      trim: true,
      escape: true,
      isLength: {
        options: { max: 200 },
        errorMessage: 'La dirección debe tener máximo 200 caracteres',
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s,.\-#º/]{4,}$/,
        errorMessage:
          'La dirección contiene caracteres no permitidos o es muy corta',
      },
    },

    name: {
      in: ['body'],
      errorMessage: 'Nombre inválido ',
      trim: true,
      escape: true,
      exists: {
        options: {
          checkNull: true, // Considera null como no existente
          checkFalsy: true, // Considera cualquier valor "falsy" ("" o 0, por ejemplo) como no existente
        },
        errorMessage: 'El nombre es obligatorio', // Este mensaje será lanzado si no existe el valor
      },
      isLength: {
        options: { max: 30 },
        errorMessage: 'El nombre debe tener máximo 30 caracteres',
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
        errorMessage:
          'El nombre debe tener al menos 4 caracteres alfanuméricos',
      },
    },
    email: {
      in: ['body'],
      errorMessage: 'Email inválido',
      exists: {
        options: {
          checkNull: true, // Considera null como no existente
          checkFalsy: true, // Considera cualquier valor "falsy" ("" o 0, por ejemplo) como no existente
        },
        errorMessage: 'El email es obligatorio', // Este mensaje será lanzado si no existe el valor
      },
      isLength: {
        options: { max: 50 },
        errorMessage: 'El email debe tener máximo 50 caracteres',
      },
      trim: true,
      escape: true,
      matches: {
        options: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errorMessage: 'Formato de email inválido',
      },
    },
    description: {
      in: ['body'],
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: 'La descripción no puede estar vacía',
      },
      isLength: {
        options: { min: 10, max: 1200 },
        errorMessage: 'La descripción debe tener entre 10 y 500 caracteres',
      },
    },
    phone: {
      in: ['body'],
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: 'El teléfono no puede estar vacío',
      },
      isLength: {
        options: { min: 7, max: 16 },
        errorMessage: 'El teléfono debe tener entre 7 y 16 caracteres',
      },
      matches: {
        options: /^(\+?\d{1,4}|00\d{1,4})?\d{6,12}$/,
        errorMessage:
          'El teléfono contiene un formato inválido (solo números, sin espacios)',
      },
    },
    type_food: {
      in: ['body'],
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: 'El tipo de comida no puede estar vacío',
      },
      isLength: {
        options: { min: 3, max: 25 },
        errorMessage: 'El tipo de comida debe tener entre 3 y 25 caracteres',
      },
      matches: {
        // Acepta solo letras (mayúsculas, minúsculas) y espacios
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        errorMessage: 'El tipo de comida solo debe contener letras',
      },
    },
    web: {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 10, max: 250 },
        errorMessage: 'La web debe tener entre 10 y 250 caracteres',
      },
      matches: {
        options: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
        errorMessage:
          'La web debe ser una URL válida (ej. https://ejemplo.com)',
      },
    },
  }),
 get: checkExact(
    checkSchema({
      id: {
        in: ['params'],
        isUUID: {
          errorMessage: 'Id debe ser un UUID válido',
        },
        optional: true,
        custom: {
          options: async (value) => {
            const [rows]: [any[], any] = await promisePool.query(isRestaurant(), [
              value,
            ]);

            if (rows.length === 0) {
              throw new Error(
                'No existe un restaurante con ese ID en la base de datos',
              );
            }

            return true;
          },
        },
      },
      name: {
        in: ['query'],
        optional: true,
        errorMessage: 'Nombre inválido',
        isLength: {
          options: { max: 30 },
          errorMessage: 'El nombre debe tener máximo 30 caracteres',
        },
        matches: {
          options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
          errorMessage:
            'El nombre debe tener al menos 4 caracteres alfanuméricos',
        },
      },
      address: {
        in: ['query'],
        optional: true,
        errorMessage: 'Dirección inválida',
        trim: true,
        escape: true,
        isLength: {
          options: { max: 50 },
          errorMessage: 'La dirección debe tener máximo 50 caracteres',
        },
        matches: {
          options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
          errorMessage:
            'La dirección debe tener al menos 4 caracteres alfanuméricos',
        },
      },
      type_food: {
        in: ['query'],
        optional: true,
        errorMessage: 'Tipo de comida inválido',
        customSanitizer: {
          options: (value) => {
            if (!value) return [];
            const array = Array.isArray(value) ? value : [value];
            return array.map(t => String(t).trim().toLowerCase()).filter(t => t !== "");
          }
        },
        custom: {
          options: (value) => {
            if (!Array.isArray(value) || value.length === 0) return true;
            
            const validOptions = ['italiana', 'china', 'mexicana', 'japonesa', 'india', 'mediterranea', 'española', 'turca'];
            const allValid = value.every(t => validOptions.includes(t));
            if (!allValid) {
              throw new Error(`Los tipos de comida deben ser opciones válidas: ${validOptions.join(', ')}`);
            }
            return true;
          }
        }
      },
      limit: {
        in: ['query'],
        optional: true,
        errorMessage: 'Limite invalido',
        trim: true,
        escape: true,
        isLength: {
          options: { max: 2 },
          errorMessage: 'El limite debe tener como maximo 2 cifras',
        },
        isInt: {
          errorMessage: 'El limite es invalido debe ser un entero',
        },
        toInt: true,
      },
      offset: {
        in: ['query'],
        optional: true,
        errorMessage: 'Paginación invalida',
        trim: true,
        escape: true,
        isLength: {
          options: { max: 2 },
          errorMessage: 'La paginación debe tener como maximo 2 cifras',
        },
        isInt: {
          errorMessage: 'La paginación es invalida debe ser un entero',
        },
        toInt: true,
      },
    }),
    {
      message: 'Se han enviado parámetros no permitidos o mal escritos',
    }
  ),
  remove: checkSchema({
    id: {
      in: ['params'],
      isUUID: {
        errorMessage: 'Id debe ser un UUID válido',
      },
      optional: true,
      custom: {
        options: async (value) => {
          const [rows]: [any[], any] = await promisePool.query(isRestaurant(), [
            value,
          ]);

          if (rows.length === 0) {
            throw new Error(
              'No existe un restaurante con ese ID en la base de datos',
            );
          }

          return true;
        },
      },
    },
  }),
};

export { RestaurantSchema };
