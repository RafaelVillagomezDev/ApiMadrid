import { Request, Response, NextFunction } from 'express';

import { tokenSign } from '../utils/handle-jwt';
import { ApiResponseInterface } from 'api-type.js';
import { UserData } from 'jwt-type.js';


const config =
{
    ANON_CLIENT_SECRET: process.env.ANON_CLIENT_SECRET!,
    ANON_CLIENT_ID: process.env.ANON_CLIENT_ID!,
    ANON_USER_ID: process.env.ANON_USER_ID || 'ANON_DEFAULT_ID_FALLBACK',
}


const AnonymusController = {
    loginAnonymous: async (
        req: Request,
        res: Response<ApiResponseInterface>,
        next: NextFunction
    ): Promise<void> => {

        // Obtener los secretos que envía la aplicación frontend
        const { client_id, client_secret } = req.body;

        
        // 1. Verificar Secretos de la Aplicación 
        if (client_id !== process.env.ANON_CLIENT_ID! || client_secret !==  config.ANON_CLIENT_SECRET)
        {
            // Credenciales incorrectas, no emitir token
            res.status(401).json({
                message: "Credenciales de aplicación inválidas. Acceso denegado.",
                code: 401
            });
            return
        }

        try {


            const payloadData: UserData = {
                id_user: config.ANON_CLIENT_ID,
                email: 'anonymous_local_api_madrid@api.com',
                rol: 'no_cliente',
            };

            // 3. Firmar el Token JWT
            // Llamada a la utilidad que firma el token (expiresIn: "15m")
            const accessToken = tokenSign(payloadData);

            // 4. Respuesta: Devolver el token
            res.status(200).json({
                message: "Acceso anónimo concedido. Token de acceso emitido.",
                data: {
                    token: accessToken,
                },
                code: 200
            });

        } catch (error) {
            next(error);
        }
    }
}

export default AnonymusController;