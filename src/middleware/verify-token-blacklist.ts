import { Request, Response, NextFunction } from 'express';
import { findTokenBlacklist } from '../models/blacklist/blacklist-model';

export const checkBlacklist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Extraemos el user de forma segura
        const user = (req as any).user;

        // 2. Si no hay user o no hay jti, el token no pasó por authToken correctamente
        if (!user?.jti) {
            return res.status(401).json({ 
                error: "INVALID_CONTEXT",
                message: "No se pudo identificar la sesión (Falta JTI)." 
            });
        }

        // 3. Consultamos tu modelo en MySQL
        const isRevoked = await findTokenBlacklist(user.jti);

        if (isRevoked) {
            return res.status(403).json({
                error: "TOKEN_REVOKED",
                message: "Este token ya no es válido, por favor inicia sesión de nuevo."
            });
        }

        // Si llegamos aquí, el token es legítimo y no está bloqueado
        next();
    } catch (error) {
        // Logueamos el error para el desarrollador, pero respondemos algo genérico
        console.error("Error en Middleware Blacklist:", error);
        return res.status(500).json({ message: "Error interno de validación de seguridad" });
    }
};