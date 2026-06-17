import { checkSchema } from 'express-validator';
import { pool } from '../connection/bd';
import { isUser } from '../queries/user-query';

const promisePool = pool.promise();

const UserSchema = {
    login: checkSchema({
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
            custom: {
                options: async (value) => {

                    const [rows]: [any[], any] = await promisePool.query(isUser(), [
                        value,
                    ]);

                    if (rows[0].exists === 0) {

                        throw new Error(
                            'No existe un usuario con ese correo en la base de datos',
                        );
                    }

                    return true;
                }
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
        password: {
            in: ['body'],
            exists: {
                options: {
                    checkNull: true,
                    checkFalsy: true,
                },
                errorMessage: 'La contraseña es obligatoria',
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                },
                errorMessage: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
            }
        }
    }),

    create: checkSchema({
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
        surname: {
            in: ['body'],
            errorMessage: 'Apellido inválido ',
            trim: true,
            escape: true,
            exists: {
                options: {
                    checkNull: true, // Considera null como no existente
                    checkFalsy: true, // Considera cualquier valor "falsy" ("" o 0, por ejemplo) como no existente
                },
                errorMessage: 'El apellido es obligatorio',
            },
            isLength: {
                options: { max: 30 },
                errorMessage: 'El apellido debe tener máximo 30 caracteres',
            },
            matches: {
                options: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{4,}$/,
                errorMessage:
                    'El apellido debe tener al menos 4 caracteres alfanuméricos',
            },
        },
    })
}

export { UserSchema };
