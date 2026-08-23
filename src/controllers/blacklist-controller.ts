import { Request, Response } from 'express';
import { addToken } from '../../src/models/blacklist/blacklist-model';
import { RefreshToken } from '../../src/models/auth/refresh-token-model';

interface JwtPayload {
  jti: string;
  exp: number;
  id_user: string | number;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const revokeSession = async (req: AuthRequest, res: Response) => {
  try {
   
    const userPayload = req.user;

    if (!userPayload || !userPayload.jti) {
      return res
        .status(400)
        .json({ message: 'No se encontró información de sesión válida' });
    }

    const { jti, exp, id_user } = userPayload;

   
    const expiresAt = new Date(exp * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    await addToken(
      jti,
      'LOGOUT_MANUAL',
      expiresAt,
      `El usuario ${id_user} cerró sesión`,
    );

    
    await RefreshToken.deleteAllTokensByUser(String(id_user));

    
    res.clearCookie('userRefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'none', 
      path: '/api/v1/auth/refresh' 
    });

    res.clearCookie('_csrf_token', { 
        path: '/' 
    });

    return res.status(200).json({
      message: 'Sesión invalidada con éxito',
      code: 200,
    });
  } catch (error) {
    console.error('Error en revokeSession:', error);
    return res.status(500).json({ message: 'Error al invalidar el token' });
  }
};