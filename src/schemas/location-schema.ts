import { checkSchema } from 'express-validator';

const LocationSchema = {
  create: checkSchema({
    id: {
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
  }),
};

export { LocationSchema };
