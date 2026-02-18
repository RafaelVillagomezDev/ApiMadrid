"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Middleware de manejo de errores que se enviaran al cliente
const errorHandler = (err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';
    res.status(status).send({
        success: false,
        message: message,
        code: status,
    });
};
exports.errorHandler = errorHandler;
