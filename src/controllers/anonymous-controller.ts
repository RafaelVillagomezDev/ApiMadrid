// AnonymusController.ts
import { Request, Response, NextFunction } from 'express';

import { tokenSign } from '../utils/handle-jwt';
import { ApiResponseInterface } from 'api-type.js';
import { UserData } from 'jwt-type.js';

// NOTA DE MEJORA: Definir config una sola vez a nivel de módulo
const config =
{
    ANON_USER_ID: process.env.ANON_USER_ID || 'ANON_DEFAULT_ID_FALLBACK',
}


const AnonymusController = {
   
    loginAnonymous: async (
        req: Request,
        res: Response<ApiResponseInterface>,
        next: NextFunction
    ): Promise<void> => {
    
        try {
  
            const payloadData: UserData = {
                id_user: config.ANON_USER_ID, 
                email: `anonymous_${config.ANON_USER_ID}@api.com`, 
                rol: 'no_cliente',
            };

        
            const accessToken = await tokenSign(payloadData);

       
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