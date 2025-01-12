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
    url: {
      in: ['body'],
      isURL: {
        errorMessage: 'La URL proporcionada no es válida',  
      },
      notEmpty: {
        errorMessage: 'La URL es obligatoria',  
      },
      customSanitizer: {
        options: (value: string) => {
          // Verifica si el protocolo es http y lo reemplaza por https
          if (value.startsWith('http://')) {
            return value.replace('http://', 'https://');
          }
          // Si no es http, asegúrate que sea https
          if (!value.startsWith('https://')) {
            throw new Error('La URL debe tener el protocolo https:// y es obligatotia');
          }
          return value;
        },
      },
    }
    
  }),
 
};

export { ImageSchema };
