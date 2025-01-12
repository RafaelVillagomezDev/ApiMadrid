import { checkSchema } from 'express-validator';

const RestaurantSchema = {
  create: checkSchema({
    address: {
      in: ["body"],
      errorMessage: "Dirección inválida",
      trim: true,
      escape: true,
      isLength: {
        options: { max: 50 },
        errorMessage: "La  dirección tener máximo 30 caracteres",
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
        errorMessage: "La dirección debe tener al menos 4 caracteres alfanuméricos",
      },
    },
    
    name: {
      in: ["body"],
      errorMessage: "Nombre inválido ",
      trim: true,
      escape: true,
      notEmpty:{
        errorMessage:"El nombre es obligatorio"
      },
      isLength: {
        options: { max: 30 },
        errorMessage: "El nombre debe tener máximo 30 caracteres",
      },
      matches: {
        options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
        errorMessage: "El nombre debe tener al menos 4 caracteres alfanuméricos",
      },
    },
    email: {
      in: ['body'],
      errorMessage: 'Email inválido',
      notEmpty:{
        errorMessage:"El email es obligatorio"
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
  }),
};

export { RestaurantSchema };
