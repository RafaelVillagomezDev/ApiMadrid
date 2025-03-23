import { checkSchema } from 'express-validator';

const RestaurantSchema = {
  create: checkSchema({
    address: {
      in: ['body'],
      errorMessage: 'Dirección inválida',
      trim: true,
      escape: true,
      isLength: {
        options: { max: 50 },
        errorMessage: 'La  dirección tener máximo 30 caracteres',
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
        errorMessage:
          'La dirección debe tener al menos 4 caracteres alfanuméricos',
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
      optional: {
        options: { nullable: true }, // No ejecuta las validaciones si el campo es falsy (vacío, null, etc.)
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
      optional: {
        options: { nullable: true }, // No ejecuta las validaciones si el campo es falsy (vacío, null, etc.)
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
      trim: true,
      notEmpty: {
        errorMessage: 'La descripción no puede estar vacía',
      },
      isLength: {
        options: { min: 10, max: 1200 },
        errorMessage: 'La descripción debe tener entre 10 y 500 caracteres',
      },
      matches: {
        options: /^[a-zA-Z0-9\s.,!?"'-]+$/,
        errorMessage: 'La descripción contiene caracteres no permitidos',
      },
    }
  }),
};

export { RestaurantSchema };
