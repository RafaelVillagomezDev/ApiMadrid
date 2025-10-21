import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from 'api-type';

// Configuración de la clave secreta y nombres
const COOKIE_SECRET:string = process.env.COOKIE_SECRET as string;
if (!COOKIE_SECRET) {
    throw new Error("FATAL: La variable de entorno Cookie no está definida. La aplicación no puede iniciar.");
}
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = '_csrf_token';

// Genera un token aleatorio seguro
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Middleware para inicializar el parser de cookies
export const initCookieParser = cookieParser(COOKIE_SECRET);

// Middleware de Protección CSRF (Doble Envío de Cookie)
export const csrfProtection = (req: Request,
    res: Response<ApiResponseInterface>,
    next: NextFunction,) => {
    // 1. Obtener los tokens
    const cookieToken = req.signedCookies[CSRF_COOKIE_NAME];
    const headerToken = req.headers[CSRF_HEADER_NAME];

    // 2. Crear/Renovar la Cookie si no existe o ha caducado
    if (!cookieToken) {
        const newToken = generateToken();

        // La cookie debe ser legible por JavaScript (httpOnly: false)
        res.cookie(CSRF_COOKIE_NAME, newToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite:'lax',
            maxAge: 3600000 // 1 hora de validez
        });
    }

    // 3. Pasar GET/HEAD/OPTIONS sin verificación
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
    }

    // 4. Verificación para POST/PUT/DELETE/PATCH (Métodos que cambian el estado)
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH') {
        if (!headerToken || cookieToken !== headerToken) {
            // logger.error('CSRF Fallo: Token no coincide o está ausente.', { ip: req.ip });
            const response : ApiResponseInterface={ message: 'Acceso denegado. Token CSRF inválido.', code: 403 }
            return res.status(403).json(response);
        }
    }

    next();
};