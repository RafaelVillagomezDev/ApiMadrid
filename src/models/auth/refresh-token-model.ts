import { pool } from '../../connection/bd'; // Ajusta la ruta a tu conexión
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { RefreshTokenInterface } from '../../types/refresh-token-type';
import { createRefreshTokenQuery, deleteAllTokensByUserQuery, deleteTokenByIdQuery, findValidTokenQuery} from '../../queries/refresh-token-query';

class RefreshToken implements RefreshTokenInterface {
  id?: number;
  user_id: string;
  token: string;
  expires_at: Date;

  constructor({ id, user_id, token, expires_at }: RefreshTokenInterface) {
    this.id = id;
    this.user_id = user_id;
    this.token = token;
    this.expires_at = expires_at;
  }

  /**
   * Guarda un nuevo Refresh Token en la base de datos
   * @param userId El ID del usuario asociado
   * @param token El hash o cadena segura del token
   * @param expiresInDays Los días que el token será válido
   * @returns El ID insertado
   */
  static async saveToken(userId: string, token: string, expiresInDays: number): Promise<number> {
    const conn = await pool.promise().getConnection();
    
    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const formattedDate = expiresAt.toISOString().slice(0, 19).replace('T', ' ');

    try {
      
      
      const [result] = await conn.execute<ResultSetHeader>(createRefreshTokenQuery(), [userId, token, formattedDate]);
      
      if (result.affectedRows === 0) {
        throw new Error('No se pudo insertar el Refresh Token en la base de datos.');
      }
      
      return result.insertId;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error al guardar el refresh token: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }

  /**
   * Busca un Refresh Token en la base de datos (y verifica que no haya expirado)
   * @param token La cadena del token a buscar
   * @returns Un objeto RefreshTokenInterface si existe y es válido, o null.
   */
  static async findValidToken(token: string): Promise<RefreshTokenInterface | null> {
    const conn = await pool.promise().getConnection();
    try {
      
      
      const [rows] = await conn.execute<RowDataPacket[]>(findValidTokenQuery(), [token]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const tokenData = rows[0] as RefreshTokenInterface;
      return new RefreshToken(tokenData);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error al buscar el refresh token: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }

  /**
   * Elimina un token de la base de datos por su ID (ej. después de rotarlo)
   * @param tokenId El ID (autonumérico) del token a eliminar
   */
  static async deleteTokenById(tokenId: number): Promise<boolean> {
    const conn = await pool.promise().getConnection();
    try {
     
      const [result] = await conn.execute<ResultSetHeader>(deleteTokenByIdQuery(), [tokenId]);
      
      return result.affectedRows > 0;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error al eliminar el refresh token: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }

  /**
   * (Opcional) Elimina TODOS los tokens asociados a un usuario (Logout en todos los dispositivos)
   * @param userId El ID del usuario
   */
  static async deleteAllTokensByUser(userId: string): Promise<number> {
    const conn = await pool.promise().getConnection();
    try {
     
      const [result] = await conn.execute<ResultSetHeader>(deleteAllTokensByUserQuery(), [userId]);
      
      return result.affectedRows;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error al limpiar los tokens del usuario: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }
}

export { RefreshToken };