import {rateLimit}  from 'express-rate-limit'
import logger from '../../src/utils/logger';


export const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos penalizacion
    max: 50, // 50 solicitudes maximo por IP
    standardHeaders: true, 
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.',
        code: 429,
    },
    
    // --- FUNCIÓN HANDLER MODIFICADA PARA USAR logger.error ---
    handler: (req, res, next, options) => {
        
       logger.error('RATE LIMIT SUPERADO: Solicitud rechazada por  DOS', {
            // Información de la solicitud
            ip: req.ip,
            endpoint: req.originalUrl,
            method: req.method,
            // Información del límite
            limit: options.max,
            window: options.windowMs / 1000 + 's',
            statusCode: options.statusCode
        });
        
        // Termina la solicitud
        res.status(options.statusCode).send(options.message);
    },
});

// app.use('/api/', apiLimiter); // Tu código existente