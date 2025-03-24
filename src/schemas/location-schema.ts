import { checkSchema } from 'express-validator';
import { pool } from '../connection/bd';
import { isRestaurant } from '../queries/restaurant-query';


const promisePool = pool.promise();

const validateRelatedType = (value: string) => {
  if (value !== 'restaurant') {
    throw new Error('El relatedType solo puede ser "restaurant"');
  }
  return true;
};

const LocationSchema = {
  create: checkSchema({
    relatedType: {
      in: ['params'],
      exists: {
        options: {
          checkNull: true,
          checkFalsy: true,
        },
        errorMessage: 'El tipo relacionado es obligatorio',
      },
      isLength: {
        options: { max: 30 },
        errorMessage: 'El tipo debe tener máximo 30 caracteres',
      },
      custom: {
        options: validateRelatedType,
      },
    },
    relatedId: {
      in: ['params'],
      isUUID: {
        errorMessage: 'Id debe ser un UUID válido',
      },
      custom: {
        options: async (value) => {
          
          const [rows]: [any[], any] = await promisePool.query(isRestaurant(), [value]);

          if (rows.length === 0) {
            throw new Error('No existe un restaurante con ese ID en la base de datos');
          }

          return true;
        },
      },
    },
    address: {
      in: ['body'],
      trim: true,
      escape: true,
      exists: {
        options: {
          checkNull: true,
          checkFalsy: true,
        },
        errorMessage: 'La dirección es obligatoria',
      },
      isLength: {
        options: { max: 500 },
        errorMessage: 'La dirección debe tener máximo 500 caracteres',
      },
    },
  }),
};

export { LocationSchema };
