import { checkSchema } from 'express-validator';
import { pool } from '../connection/bd';

const promisePool = pool.promise();

const MenuSchema = {
  create: checkSchema({
    restaurant_id: {
      in: ['body'],
      isUUID: {
        errorMessage: 'Id de restaurante debe ser un UUID válido',
      },
     
    },
    dish_name: {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 3, max: 50 },
        errorMessage:
          'El nombre de los  platos deben de tener minimo 3 caracteres',
      },
      matches: {
        // Acepta solo letras (mayúsculas, minúsculas) y espacios
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        errorMessage: 'El tipo de comida solo debe contener letras',
      },
    },
    description: {
      in: ['body'],
      trim: true,
      optional: true,
      isLength: {
        options: { min: 3, max: 250 },
        errorMessage: 'La descripcion deben de tener minimo 3 caracteres',
      },
      matches: {
        // Acepta solo letras (mayúsculas, minúsculas) y espacios
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        errorMessage: 'El tipo de comida solo debe contener letras',
      },
    },
    price: {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 1, max: 6 },
        errorMessage:
          'La descripcion deben de tener maximo 6 cifras y 2 decimales',
      },
      matches: {
        // Acepta solo letras (mayúsculas, minúsculas) y espacios
        options: /^\d+(?:[.,]\d+)?$/,
        errorMessage:
          'El precio solo puede tener maximo 6 cifras y 2 decimales',
      },
    },
    category: {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 3, max: 50 },
        errorMessage: 'La categoria deben de tener maximo 50 caracteres ',
      },
      matches: {
        // Acepta solo letras (mayúsculas, minúsculas) y espacios
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        errorMessage: 'El tipo de comida solo debe contener letras',
      },
    },
  }),
};

export { MenuSchema };
