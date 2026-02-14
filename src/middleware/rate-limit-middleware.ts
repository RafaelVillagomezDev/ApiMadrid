import { rateLimit } from 'express-rate-limit';
import logger from '../../src/utils/logger';

import { decode } from 'jsonwebtoken'; // O la librería que uses para JWT
import { addToken } from '../models/blacklist/blacklist-model';

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Has excedido el límite de peticiones. Intenta de nuevo más tarde.',
    code: 429,
  },

  handler: async (req, res, next, options) => {
    const authHeader = req.headers.authorization;
    let jtiToBlock = 'unknown';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = decode(token) as { jti?: string; exp?: number };
        if (decoded && decoded.jti) {
          jtiToBlock = decoded.jti;

          await addToken(
            decoded.jti,
            'rate_limit_abuse',
            new Date(Date.now() + options.windowMs).toISOString(),
            `Excedió el límite de ${options.max} peticiones`,
          );
        }
      } catch (err) {
        logger.error('Error al decodificar token en rate limiter', err);
      }
    }

    logger.error('RATE LIMIT SUPERADO', {
      ip: req.ip,
      jti: jtiToBlock,
      endpoint: req.originalUrl,
      method: req.method,
    });

    res.status(options.statusCode).send(options.message);
  },
});
