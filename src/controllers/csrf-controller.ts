import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from '../types/api-type';

const CsrfController = {
    getCsrfToken: (
        req: Request,
        res: Response<ApiResponseInterface>,
        next: NextFunction
    ): void => {
        try {
            // 1. Recuperamos el token que el middleware csrfProtection acaba de crear y guardar en la cabecera
            const csrfToken = res.getHeader('X-New-CSRF-Token') as string;

            if (!csrfToken) {
                 throw new Error('El middleware no generó el token CSRF.');
            }

            // 2. Preparamos la respuesta para el frontend
            const response: ApiResponseInterface = {
                message: 'Token CSRF generado con éxito',
                code: 200,
            };

           
            // 3. (Opcional) Replicar en el header 'x-csrf-token' por si tu frontend busca este específicamente
            res.setHeader('x-csrf-token', csrfToken);
            
            // 4. Exponemos los headers para que el frontend (CORS) pueda leerlos
            res.setHeader('Access-Control-Expose-Headers', 'x-csrf-token, X-New-CSRF-Token');

            res.status(200).send(response);

        } catch (error) {
            console.error('Error al obtener el token CSRF:', error);
            res.status(500).json({
                message: 'Error interno al generar token de seguridad',
                code: 500
            });
        }
    },
};

export default CsrfController;