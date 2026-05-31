import { checkSchema } from 'express-validator';

const MenuSchema = {
  create: checkSchema({
    restaurant_id: {
      in: ['params'],
      trim: true,
      optional: false,
      isUUID: {
        errorMessage: 'El ID del restaurante debe ser un UUID válido',
      },
    },
    name: {
      in: ['body'],
      trim: true,
      optional: false,
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
        errorMessage:
          'La descripción del menú debe tener al menos 3 caracteres',
      },
    }
  }),
};

export { MenuSchema };
