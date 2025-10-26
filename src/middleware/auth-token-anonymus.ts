import { Request, Response, NextFunction } from 'express';


const EXPECTED_API_KEY = process.env.ANON_API_KEY || process.env.ANON_CLIENT_SECRET;


export const authTokenAnonymus = (req: Request, res: Response, next: NextFunction) => {

    const apiKey = req.header('x-api-key');


    if (!apiKey) {
        return res.status(401).json({
            message: "Acceso no autorizado. Se requiere el encabezado 'X-API-Key'.",
            code: 401
        });
    }


    if (apiKey !== EXPECTED_API_KEY || !EXPECTED_API_KEY) {


        return res.status(401).json({
            message: "Clave de API inválida. Acceso denegado.",
            code: 401
        });
    }

    next();
};