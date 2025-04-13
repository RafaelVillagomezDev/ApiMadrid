import logger from '../utils/logger'; 
import { Request, Response, NextFunction } from 'express';

// Funcion logger para tener los logs de cada peticion
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => { 
  const start = process.hrtime();
  
  // Llamamos al siguiente middleware
  next();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2); // Duración en ms

    const logData = {
      method: req.method,           // GET, POST, etc.
      url: req.originalUrl,         // Ruta solicitada
      status: res.statusCode,       // Código de respuesta
      duration: `${durationInMs}ms`, // Duración de la petición
      ip: req.ip || req.connection.remoteAddress, // IP del cliente
      headers: req.headers,         // Encabezados de la solicitud
      userAgent: req.headers['user-agent'], // Agente de usuario
    };

    
    // Envío del log con nivel 'info'
    logger.info(`${req.method} ${req.originalUrl}`, logData);
  });
};
