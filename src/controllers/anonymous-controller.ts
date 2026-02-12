import { Request, Response, NextFunction } from 'express';
import { tokenSign } from '../utils/handle-jwt';
import { ApiResponseInterface } from 'api-type.js';
import { UserData } from 'jwt-type.js';
import crypto from 'crypto'; // Módulo nativo para generar IDs únicos

const AnonymusController = {
    loginAnonymous: async (
        req: Request,
        res: Response<ApiResponseInterface>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // Generamos un ID único para esta sesión específica
            const uniqueAnonId = crypto.randomUUID();

            const payloadData: UserData = {
                id_user: uniqueAnonId, 
                email: `${uniqueAnonId}@api.com`, 
                rol: 'no_cliente',
                jti: crypto.randomUUID() 
            };

            const accessToken = await tokenSign(payloadData);

            res.status(200).json({
                message: "Acceso anónimo único concedido.",
                data: {
                    user: {
                        token: accessToken,
                    }
                },
                code: 200
            });

        } catch (error) {
            next(error); 
        }
    }
}

export default AnonymusController;