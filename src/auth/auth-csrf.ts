import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import { ApiResponseInterface } from '../types/api-type';

// 1. Configuración de la clave secreta
const COOKIE_SECRET: string = process.env.COOKIE_SECRET as string;
if (!COOKIE_SECRET) {
  throw new Error(
    'FATAL: La variable de entorno COOKIE_SECRET no está definida. La aplicación no puede iniciar.',
  );
}

// 2. Lógica inteligente basada en el entorno (NODE_ENV de tu package.json)
const isProductionOrPre = ['production', 'preproduction'].includes(process.env.NODE_ENV || '');

// En Prod/Pre usa 'lax'. En desarrollo usa 'none' para evitar problemas de CORS en localhost.
const envSameSite = (process.env.COOKIE_SAME_SITE || (isProductionOrPre ? 'lax' : 'none')) as 'lax' | 'none' | 'strict';

// Si sameSite es 'none', los navegadores exigen obligatoriamente que secure sea true.
const isSecure = isProductionOrPre ? true : (envSameSite === 'none');

// 3. Configuración centralizada de la cookie (EXPORTADA para usar en UserController.loginUser)
export const cookieConfig: CookieOptions = {
  httpOnly: true,     // 🔥 Blindado: El navegador protege la cookie contra ataques XSS
  secure: isSecure,   // HTTPS obligatorio según el entorno
  signed: true,       // Encriptado y firmado en el almacenamiento del navegador
  sameSite: envSameSite,
  maxAge: 30 * 60 * 1000, // 30 minutos
  path: '/',
};

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
  const isNewCsrfRoute = req.originalUrl.includes('/api/v1/csrf'); 
  
  // Agrupamos la condición para que el código sea más limpio y fácil de leer
  const isGeneratingToken = isTokenRoute || isTokenRouteClient || isNewCsrfRoute;
  
  const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  // Obtener los tokens (Usamos signedCookies para máxima seguridad)
  let cookieToken = req.signedCookies[CSRF_COOKIE_NAME];
  
  // 🔥 Limpieza segura del header: previene errores si el frontend envía el token duplicado (con comas o como array)
  let rawHeaderToken = req.headers[CSRF_HEADER_NAME];
  let headerToken: string | undefined;

  if (Array.isArray(rawHeaderToken)) {
    headerToken = rawHeaderToken[0];
  } else if (typeof rawHeaderToken === 'string') {
    headerToken = rawHeaderToken.split(',')[0].trim();
  }

  // Si no hay cookie o estamos en una ruta de generación de token
  if (!cookieToken || isGeneratingToken) {
    cookieToken = generateToken();

    // Guardamos el token de forma ultra segura usando la configuración dinámica (sobrescribe automáticamente la anterior)
    res.cookie(CSRF_COOKIE_NAME, cookieToken, cookieConfig);

    // 🔥 LA CLAVE: Enviamos el token limpio en la cabecera de respuesta HTTP
    res.setHeader('X-New-CSRF-Token', cookieToken);
    
    // Guardamos en res.locals para que el controlador final pueda leerlo
    res.locals.csrfToken = cookieToken;

    if (isGeneratingToken) return next();
  }

  // Si es un método de solo lectura, dejamos pasar sin validar el token
  if (isSafeMethod) return next();

  //  Validación estricta para métodos de escritura (POST, PUT, DELETE)
  if (!headerToken || !cookieToken || cookieToken !== headerToken) {
    console.error({
      alerta: '[CSRF Fallo]',
      headerRecibido: headerToken || 'UNDEFINED (El frontend no lo envió o lo envió mal)',
      cookieRecibida: cookieToken || 'UNDEFINED (El navegador no envió la cookie)',
      sonIguales: cookieToken === headerToken,
      entorno: process.env.NODE_ENV
    });

    const response: ApiResponseInterface = {
      message: 'Acceso denegado. Los tokens CSRF no coinciden o han expirado.',
      code: 403,
    };
    return res.status(403).json(response);
  }

  next();
};