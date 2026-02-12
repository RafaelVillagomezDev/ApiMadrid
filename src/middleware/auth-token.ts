
import { verifyToken } from '../utils/handle-jwt';
import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from 'api-type';
/*
  Middleware: función que verifica la autenticidad del token (Authorization: Bearer <token>)
  y adjunta el payload del usuario a la petición si es válido.
*/
export const authToken = async (
    req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,
): Promise<void> => {

 
    const authHeader = req.headers["authorization"];
    // 1. Valida Bearer en el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Error en la validación de los datos.',
            code: 400,
        });
        return;
    }

    try {
        // 2. Extraer el token: Divide por espacio y toma la segunda parte (el token)
        const token = authHeader.split(" ")[1];

        // 3. Verificar el token. Asegúrate de que verifyToken ahora devuelve el payload o null
        const payloadToken = await verifyToken(token);

        // 4. Validar el payload
        if (!payloadToken || !payloadToken.id_user) {
            res.status(401).json({
                message: 'Acesso invalido',
                code: 401,
            });
            return;
        }

        (req as any).user = payloadToken; 



        next();

    } catch (error) {

        next(error)
    }
};