import { Request, Response } from 'express';
import crypto from 'crypto';
// Importa tus modelos y herramientas
import { RefreshToken } from '../models/auth/refresh-token-model';
import { User } from '../models/user/user-model';
import { tokenSign } from '../utils/handle-jwt';
import { UserData } from '../types/jwt-type';

const AuthController = {
    
   
    refreshToken: async (req: Request, res: Response): Promise<void> => {
        try {
            // Extraemos la cookie httpOnly que el navegador envió automáticamente
            const incomingRefreshToken = req.cookies.userRefreshToken;

            if (!incomingRefreshToken) {
                 res.status(401).json({ message: 'No se encontró el token de renovación (Refresh Token).' });
                 return;
            }

        
            
            const validTokenRecord = await RefreshToken.findValidToken(incomingRefreshToken);

            if (!validTokenRecord) {
                // Si la consulta devuelve null, el token no existe o YA CADUCÓ.
                // Obligamos al usuario a iniciar sesión manualmente limpiando su cookie.
                res.clearCookie('userRefreshToken', { path: '/api/v1/auth/refresh' });
                res.status(403).json({ message: 'Sesión expirada o inválida. Por favor, inicia sesión de nuevo.' });
                return;
            }

            const userDB = await User.findById(validTokenRecord.user_id);
            if (!userDB) {
                 res.status(404).json({ message: 'Usuario asociado al token no encontrado.' });
                 return;
            }

            
            // Borramos el que acaba de usar y le damos uno nuevo de 7 días.
            await RefreshToken.deleteTokenById(validTokenRecord.id!);
            const newRefreshTokenString = crypto.randomBytes(64).toString('hex');
            await RefreshToken.saveToken(userDB.id!, newRefreshTokenString, 7);

            //  Fabricamos el NUEVO Access Token (JWT 15 mins)
            const payloadData: UserData = {
                id_user: userDB.id!,
                email: userDB.email,
                rol: (userDB.role ?? 'no_cliente') as 'cliente' | 'admin' | 'no_cliente',
                jti: crypto.randomUUID(),
            };
            const newAccessToken = await tokenSign(payloadData);

            //  Enviamos la nueva cookie de Refresh rotada
           res.cookie('userRefreshToken', newRefreshTokenString, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                // 🔥 SOLUCIÓN: Usar la misma lógica dinámica que en el login
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
                path: '/api/v1/auth/refresh', 
                maxAge: 30*60* 1000 // Ponlo a 60 minutos para que coincida con tu prueba
            });
            
            res.status(200).json({
                message: 'Token renovado con éxito',
                data: {
                    user: { token: newAccessToken }
                }
            });

        } catch (error) {
            console.error('Error en refreshToken:', error);
            res.status(500).json({ message: 'Error interno al renovar la sesión.' });
        }
    }
};

export default AuthController;