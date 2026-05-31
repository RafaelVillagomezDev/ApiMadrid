import { checkSchema } from 'express-validator';
import { pool } from '../connection/bd';
import { isRestaurant } from '../queries/restaurant-query';
import { isMenu } from '../queries/menu-query';
const promisePool = pool.promise();

const DishSchema = {
    create: checkSchema({
        dishes: {
            in: ['body'],
            isArray: {
                options: { min: 1 },
                errorMessage: 'Debe proporcionar un array de platos con al menos un elemento',
            },
        },
        'dishes.*.restaurant_id': {
            in: ['params'], 
            trim: true,
            optional: false,
            isUUID: {
                errorMessage: 'El ID del restaurante debe ser un UUID válido',
            },
            custom: {
                options: async (value) => {
                    const [rows]: [any[], any] = await promisePool.query(isRestaurant(), [value]);
                    if (rows.length === 0) {
                        throw new Error('No existe un restaurante con ese ID en la base de datos');
                    }
                    return true;
                },
            }
        },
        'dishes.*.menu_id': {
            in: ['body'],
            trim: true,
            optional: true,
            isUUID: {
                errorMessage: 'El ID del menú debe ser un UUID válido',
            },
            custom: {
                options: async (value) => {
                    // Evitamos query innecesaria si el valor opcional no viene
                    if (!value) return true; 
                    
                    const [rows]: [any[], any] = await promisePool.query(isMenu(), [value]);
                    if (rows.length === 0) {
                        throw new Error('No existe un menú con ese ID en la base de datos');
                    }
                    return true;
                },
            }
        },
        'dishes.*.name': {
            in: ['body'],
            trim: true,
            optional: false,
            isLength: {
                options: { min: 3, max: 100 },
                errorMessage: 'El nombre del plato debe tener entre 3 y 100 caracteres',
            },
        },
        'dishes.*.description': {
            in: ['body'],
            optional: true,
            trim: true,
            isLength: {
                options: { min: 3, max: 250 },
                errorMessage: 'La descripción del plato debe tener al menos 3 caracteres',
            },
        },
        'dishes.*.price': {
            in: ['body'],
            optional: false,
            isFloat: {
                options: { min: 0 },
                errorMessage: 'El precio del plato debe ser un número positivo',
            },
        },
        'dishes.*.category': {
            in: ['body'],
            optional: false,
            isString: {
                errorMessage: 'La categoría debe ser un formato de texto válido (string)',
            },
            trim: true,
            isIn: {
                options: [['entrantes', 'principal', 'postres', 'bebidas']],
                errorMessage: 'La categoría debe ser una de las siguientes: entrantes, principal, postres o bebidas',
            },
        }
    }),
};
export { DishSchema };
