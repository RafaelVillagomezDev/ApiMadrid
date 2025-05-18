import { checkSchema } from 'express-validator';

const MenuSchema = {
  create: checkSchema({
    restaurant_id: {
      in: ['body'],
      trim: true,
      optional:false,
      isUUID: {
        errorMessage: 'El ID del restaurante debe ser un UUID válido',
      },
    },
    name: {
      in: ['body'],
      trim: true,
      optional:false,
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: 'El nombre del menú debe tener entre 3 y 100 caracteres',
      },
    },
    description: {
      in: ['body'],
      optional: true,
      trim: true,
      isLength: {
        options: { min: 3, max: 250 },
        errorMessage: 'La descripción del menú debe tener al menos 3 caracteres',
      },
    },
    'dishes': {
      in: ['body'],
      isArray: {
        options: { min: 1 },
        errorMessage: 'Debe incluir al menos un plato ',
      },
    },
    'dishes.*.name': {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 3, max: 50 },
        errorMessage: 'El nombre del plato debe tener entre 3 y 50 caracteres',
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,()]+$/,
        errorMessage: 'El nombre del plato contiene caracteres inválidos',
      },
    },
    'dishes.*.description': {
      in: ['body'],
      optional: true,
      trim: true,
      isLength: {
        options: { min: 3, max: 250 },
        errorMessage: 'La descripción del plato debe tener entre 3 y 250 caracteres',
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,()]+$/,
        errorMessage: 'La descripción del plato contiene caracteres inválidos',
      },
    },
    'dishes.*.price': {
      in: ['body'],
      isFloat: {
        options: { min: 0.01 },
        errorMessage: 'El precio debe ser un número válido mayor que 0',
      },
    },
    'dishes.*.category': {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 3, max: 50 },
        errorMessage: 'La categoría del plato debe tener entre 3 y 50 caracteres',
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        errorMessage: 'La categoría solo debe contener letras y espacios',
      },
    },
  }),
};

export { MenuSchema };
