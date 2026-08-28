import { checkSchema } from 'express-validator';

const validateRelatedType = (value: string) => {
  if (value !== 'restaurant') {
    throw new Error('El relatedType solo puede ser "restaurant"');
  }
  return true;
};

const ImageSchema = {
  create: checkSchema({
    relatedId: {
      in: ['params'],
      isUUID: {
        options: 4,
        errorMessage: 'El ID debe ser un formato UUID v4 válido',
      },
    },

    relatedType: {
      in: ['params'],
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: 'El tipo relacionado es obligatorio',
      },
      matches: {
        options: /^[a-z_]+$/,
        errorMessage: 'El tipo relacionado tiene un formato inválido (solo letras minúsculas)',
      },
      isLength: {
        options: { min: 3, max: 30 },
        errorMessage: 'El tipo relacionado debe tener entre 3 y 30 caracteres',
      },

      custom: {
        options: validateRelatedType,
      },
    },
  }),
};

export { ImageSchema };
