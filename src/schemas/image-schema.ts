import { checkSchema } from 'express-validator';

const validateRelatedType = (value:string) => {
  if (value !== 'restaurant') {
    throw new Error('El relatedType solo puede ser "restaurant"');
  }
  return true;
};


const ImageSchema = {
  create: checkSchema({
    relatedId: {
      in: ['params'],
      errorMessage: 'Id debe ser un UUID válido',
      isUUID: true,
    },
    relatedType: {
      in: ['params'],
      errorMessage: 'Tipo relacionado inválido ',
      trim: true,
      escape: true,
      exists: {
        options: {
          checkNull: true, 
          checkFalsy: true, 
        },
        errorMessage: 'El tipo relacionado es  obligatorio', 
      },
      optional: {
        options: { nullable: true }, 
      },
      isLength: {
        options: { max: 30 },
        errorMessage: 'El nombre debe tener máximo 30 caracteres',
      },
      custom: {
        options: validateRelatedType
      },
    },
  }),
};

export { ImageSchema };
