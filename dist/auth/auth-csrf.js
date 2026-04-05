"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = exports.initCookieParser = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const crypto_1 = __importDefault(require("crypto"));
// Configuración de la clave secreta y nombres
const COOKIE_SECRET = process.env.COOKIE_SECRET;
if (!COOKIE_SECRET) {
    throw new Error('FATAL: La variable de entorno Cookie no está definida. La aplicación no puede iniciar.');
}
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = '_csrf_token';
// Genera un token aleatorio seguro
const generateToken = () => crypto_1.default.randomBytes(32).toString('hex');
// Middleware para inicializar el parser de cookies
exports.initCookieParser = (0, cookie_parser_1.default)(COOKIE_SECRET);
const csrfProtection = (req, res, next) => {
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
        if (isTokenRoute)
            return next();
    }
    if (isSafeMethod)
        return next();
    if (!headerToken || !cookieToken || cookieToken !== headerToken) {
        console.error(`[CSRF Alert] Header: ${headerToken ? 'Present' : 'Missing'} | Cookie: ${cookieToken ? 'Present' : 'Missing'}`);
        const response = {
            message: 'Acceso denegado. Los tokens CSRF no coinciden o han expirado.',
            code: 403,
        };
        return res.status(403).json(response);
    }
    next();
};
exports.csrfProtection = csrfProtection;
