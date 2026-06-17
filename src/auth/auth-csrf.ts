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
  const isTokenRouteClient = req.originalUrl.includes('/v1/user/token');
  const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  // 1. Obtener los tokens (Usamos signedCookies para máxima seguridad)
  let cookieToken = req.signedCookies[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || isTokenRoute || isTokenRouteClient) {
    cookieToken = generateToken();

    // Guardamos el token de forma ultra segura en una cookie firmada y oculta para JS
    res.cookie(CSRF_COOKIE_NAME, cookieToken, {
      httpOnly: true,     // 🔥 Blindado: El navegador protege la cookie contra ataques XSS
      secure: req.hostname === 'localhost' ? false : true,
      signed: true,       // Encriptado y firmado en el almacenamiento del navegador
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000, // 30 minutos
      path: '/',
    });

    // 🔥 LA CLAVE: Enviamos el token limpio en la cabecera de respuesta HTTP
    res.setHeader('X-New-CSRF-Token', cookieToken);

    if (isTokenRoute || isTokenRouteClient) return next();
  }

  if (isSafeMethod) return next();

  // 2. Validación estricta para métodos de escritura (POST, PUT, DELETE)
  if (!headerToken || !cookieToken || cookieToken !== headerToken) {
    console.error(
      `[CSRF Alert] Header: ${headerToken ? 'Present' : 'Missing'} | Cookie: ${cookieToken ? 'Present' : 'Missing'}`
    );

    const response: ApiResponseInterface = {
      message: 'Acceso denegado. Los tokens CSRF no coinciden o han expirado.',
      code: 403,
    };
    return res.status(403).json(response);
  }

  next();
};