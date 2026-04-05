"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
// Funcion logger para tener los logs de cada peticion
const requestLogger = (req, res, next) => {
    const start = process.hrtime();
    // Llamamos al siguiente middleware
    next();
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2); // Duración en ms
        const logData = {
            method: req.method, // GET, POST, etc.
            url: req.originalUrl, // Ruta solicitada
            status: res.statusCode, // Código de respuesta
            duration: `${durationInMs}ms`, // Duración de la petición
            ip: req.ip || req.connection.remoteAddress, // IP del cliente
            headers: req.headers, // Encabezados de la solicitud
            userAgent: req.headers['user-agent'], // Agente de usuario
        };
        // Envío del log con nivel 'info'
        logger_1.default.info(`${req.method} ${req.originalUrl}`, logData);
    });
};
exports.requestLogger = requestLogger;
