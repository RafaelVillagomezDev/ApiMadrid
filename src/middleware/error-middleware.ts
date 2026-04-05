import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const errorLogger = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = err instanceof Error ? err : new Error(String(err));

  const logData = {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    ip: req.ip || req.connection.remoteAddress,
    headers: req.headers,
    userAgent: req.headers['user-agent'],
    message: error.message,
    stack: error.stack,
  };

  logger.error(`${req.method} ${req.originalUrl} - ERROR`, logData);

  next(error);
};
