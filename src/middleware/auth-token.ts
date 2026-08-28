import { verifyToken } from '../utils/handle-jwt';
import { Request, Response, NextFunction } from 'express';
import { ApiResponseInterface } from '../types/api-type';

/*
  Middleware: función que verifica la autenticidad del token (Authorization: Bearer <token>)
  y adjunta el payload del usuario a la petición si es válido.
*/
export const authToken = async (
  req: Request,
  res: Response<ApiResponseInterface>,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  
  // 1. Valida Bearer en el header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Formato de token inválido o ausente.',
      code: 401, // Corregido para que coincida con el status HTTP
    });
    return;
  }

  try {
    // 2. Extraer el token: Divide por espacio y toma la segunda parte
    const token = authHeader.split(' ')[1];

    // 3. Verificar el token. Si expiró o es inválido, saltará al catch
    const payloadToken = await verifyToken(token);

    // 4. Validar el payload
    if (!payloadToken || !payloadToken.id_user) {
      res.status(401).json({
        message: 'Acceso inválido.',
        code: 401,
      });
      return;
    }

    (req as any).user = payloadToken;
    next();
    
  } catch (error: any) {
    // 🔥 CAPTURA DE ERRORES JWT PARA EVITAR EL 500
    if (error.name === 'TokenExpiredError' || error.message === 'jwt expired') {
      res.status(401).json({
        message: 'El token ha expirado.',
        code: 401,
      });
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        message: 'Firma de token inválida.',
        code: 401,
      });
      return;
    }

    // Si es otro error del sistema, sí lo mandamos al handler global
    next(error);
  }
};