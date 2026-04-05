"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHmacAuthenticity = void 0;
const crypto_1 = __importDefault(require("crypto"));
// --- CONFIGURACIÓN Y CONSTANTES ---
const SHARED_SECRET_KEY = process.env.HMAC_SECRET;
if (!SHARED_SECRET_KEY) {
    throw new Error('FATAL: La variable de entorno HMAC_SECRET no está definida. La aplicación no puede iniciar.');
}
const TIMESTAMP_TOLERANCE_MS = 5000; // 5 segundos
// --- MIDDLEWARE CORREGIDO EN TYPESCRIPT ---
const verifyHmacAuthenticity = (req, res, next) => {
    // 1. Extracción y normalización de encabezados
    const signatureHeader = req.headers['x-hmac-signature'];
    const timestampHeader = req.headers['x-request-timestamp'];
    const nonceHeader = req.headers['x-request-nonce'];
    const signature = Array.isArray(signatureHeader)
        ? signatureHeader[0]
        : signatureHeader;
    const timestampStr = Array.isArray(timestampHeader)
        ? timestampHeader[0]
        : timestampHeader;
    const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader;
    // 2. Verificación de la Presencia
    if (!signature || !timestampStr || !nonce) {
        return res
            .status(401)
            .json({ message: 'Faltan parámetros de autenticidad.', code: 401 });
    }
    const timestamp = parseInt(timestampStr, 10);
    // A. Check del Timestamp (Anti-Reproducción TARDÍA)
    const currentTime = Date.now();
    if (Math.abs(currentTime - timestamp) > TIMESTAMP_TOLERANCE_MS) {
        return res
            .status(401)
            .json({
            message: 'La solicitud ha caducado. Tenga sincronizado el reloj.',
            code: 401,
        });
    }
    // B. Cálculo y Comparación de Firma (Anti-Manipulación)
    const bodyString = req.body && Object.keys(req.body).length > 0
        ? JSON.stringify(req.body)
        : '';
    const dataToSign = `${req.method}:${bodyString}:${req.originalUrl}:${timestamp}:${nonce}`;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', SHARED_SECRET_KEY)
        .update(dataToSign)
        .digest('hex');
    if (!crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return res
            .status(401)
            .json({
            message: 'Firma de solicitud inválida. Datos alterados.',
            code: 401,
        });
    }
    next();
};
exports.verifyHmacAuthenticity = verifyHmacAuthenticity;
