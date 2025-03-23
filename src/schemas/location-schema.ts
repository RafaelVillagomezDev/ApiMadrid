import { checkSchema } from 'express-validator';

const validateRelatedType = (value:string) => {
  if (value !== 'restaurant') {
    throw new Error('El relatedType solo puede ser "restaurant"');
  }
  return true;
};

const LocationSchema = {
  create: checkSchema({
    relatedId: {
      in: ['params'],
      errorMessage: 'Id debe ser un UUID válido',
      isUUID: true,
    },
    address: {
      in: ['body'],
      errorMessage: 'Dirección inválida',
      trim: true,
      escape: true,
      isLength: {
        options: { max: 500 },
        errorMessage: 'La dirección debe tener máximo 500 caracteres',
      },
     
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

export { LocationSchema };
