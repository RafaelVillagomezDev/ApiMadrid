import { Request, Response, NextFunction } from 'express';
import { tokenSign } from '../utils/handle-jwt';
import { ApiResponseInterface } from '../types/api-type';
import { UserData } from '../types/jwt-type';
import crypto from 'crypto';
import { matchedData, validationResult } from 'express-validator';
import { UserInterface } from '../types/user-type';
import { UserFactory } from '../factory/user-factory';
import bcrypt from 'bcrypt';
import { User } from '../models/user/user-model';

const UserController = {
    loginUser: async (
        req: Request,
        res: Response<ApiResponseInterface>,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: 'Error en validación', data: errors.array(), code: 400 });
                return;
            }

            const validData = matchedData(req);
            
  
            const userDB = await User.findByEmail(validData.email);

         
            if (!userDB || typeof userDB.password !== 'string') {
                res.status(401).json({ message: 'Credenciales inválidas', code: 401 });
                return;
            }

            if (typeof validData.password !== 'string') {
                res.status(401).json({ message: 'Credenciales inválidas', code: 401 });
                return;
            }

            const isPasswordValid = await bcrypt.compare(validData.password, userDB.password);

            if (!isPasswordValid) {
                res.status(401).json({ message: 'Credenciales inválidas', code: 401 });
                return;
            }

            // 4. Creamos el payload con los datos REALES de la base de datos
            const payloadData: UserData = {
                id_user: userDB.id!,
                email: userDB.email,
                rol: (userDB.role ?? 'no_cliente') as 'cliente' | 'admin' | 'no_cliente',
                jti: crypto.randomUUID(),
            };

            // 5. Generamos el token
            const accessToken = await tokenSign(payloadData);

            res.status(200).send({
                message: 'Acceso usuario concedido.',
                data: { user: { token: accessToken } },
                code: 200,
            });
            
        } catch (error) {
            next(error);
        }
    },

    createUser: async (
        req: Request,
        res: Response<ApiResponseInterface>,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: 'Error en validación', data: errors.array(), code: 400 });
                return;
            }

            const validData = matchedData(req);


            const newUserId = crypto.randomUUID();

            const user: UserInterface = {
                id: newUserId,
                email: validData.email,
                name: validData.name,
                surname: validData.surname,
                password: await bcrypt.hash(validData.password, 10),
                role: 'cliente',
            };

               await UserFactory.createUser(user);

            res.status(201).send({
                message: 'Usuario creado con éxito.',
                code: 201,
            });


        } catch (error) {
            next(error);
        }
    }
};

export default UserController;