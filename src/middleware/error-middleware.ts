import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
}

// Middleware de manejo de errores
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  console.error('Error en la aplicación:', err);

  const status = err.status || 500;

  
  const message = err.message || "Error interno del servidor";

  
  res.status(status).send({
    success: false,  
    message: message, 
    code: status,     
  });
};

export { errorHandler };
