import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from '../types/api-type';

// Configuración de la clave secreta y nombres
const COOKIE_SECRET: string = process.env.COOKIE_SECRET as string;
if (!COOKIE_SECRET) {
  throw new Error(
    'FATAL: La variable de entorno Cookie no está definida. La aplicación no puede iniciar.',
  );
}
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = '_csrf_token';

// Genera un token aleatorio seguro
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Middleware para inicializar el parser de cookies
export const initCookieParser = cookieParser(COOKIE_SECRET);

export const csrfProtection = (
  req: Request,
  res: Response<ApiResponseInterface>,
  next: NextFunction,
) => {
  const isTokenRoute = req.originalUrl.includes('/v1/anonymous/token');
  const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  // 1. Obtener los tokens
  let cookieToken = req.signedCookies[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || isTokenRoute) {
    cookieToken = generateToken();

    res.cookie(CSRF_COOKIE_NAME, cookieToken, {
      httpOnly: false, // Obligatorio para que el Front lo lea
      secure: req.hostname === 'localhost' ? false : true, // False en local para evitar bloqueos
      signed: true, // CAMBIO CLAVE: Sin firma para que el valor sea idéntico al Header
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000, // 30 minutos
      path: '/', // Asegura que esté disponible en toda la API
    });

    if (isTokenRoute) return next();
  }

  if (isSafeMethod) return next();

  if (!headerToken || !cookieToken || cookieToken !== headerToken) {
    console.error(
      `[CSRF Alert] Header: ${headerToken ? 'Present' : 'Missing'} | Cookie: ${cookieToken ? 'Present' : 'Missing'}`,
    );

    const response: ApiResponseInterface = {
      message: 'Acceso denegado. Los tokens CSRF no coinciden o han expirado.',
      code: 403,
    };
    return res.status(403).json(response);
  }

  next();
};
