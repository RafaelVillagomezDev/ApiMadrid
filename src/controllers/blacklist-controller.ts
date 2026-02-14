import { Request, Response } from 'express';
import { addToken } from '../../src/models/blacklist/blacklist-model';

export const revokeSession = async (req: Request, res: Response) => {
  try {
    const userPayload = (req as any).user;

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
      jti, // Esto irá a la columna 'value'
      'LOGOUT_MANUAL', // Esto irá a la columna 'type'
      expiresAt, // Esto irá a la columna 'expires_at'
      `El usuario ${id_user} cerró sesión`, // Esto irá a la columna 'reason'
    );

    // 4. Limpieza de cookies si las usas
    res.clearCookie('anonymousRefreshToken');

    return res.status(200).json({
      message: 'Sesión invalidada con éxito',
      code: 200,
    });
  } catch (error) {
    console.error('Error en revokeSession:', error);
    return res.status(500).json({ message: 'Error al invalidar el token' });
  }
};
