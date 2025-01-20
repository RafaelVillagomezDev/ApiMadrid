import { checkSchema } from 'express-validator';

const ImageSchema = {
  create: checkSchema({
    id: {
      in: ['params'],
      errorMessage: 'Id de restaurante debe ser un UUID valido',
      isUUID: true,
      trim: true,
      escape: true,
    },
    relatedType: {
      in: ['body'],
      errorMessage: 'Typo de dato debe ser un nombre valido',
      exists: {
        options: {
          checkNull: true,
          checkFalsy: true,
        },
        errorMessage: 'El relatedType es obligatorio',
      },
      optional: {
        options: { nullable: true }, // No ejecuta las validaciones si el campo es falsy (vacío, null, etc.)
      },
      isLength: {
        options: { max: 50 },
        errorMessage: 'El relatedType debe tener maximo 50 caracteres',
      },
      trim: true,
      escape: true,
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
        errorMessage:
          'El relatedType debe tener al menos 4 caracteres alfanuméricos',
      },
    },
  }),
};

export { ImageSchema };
