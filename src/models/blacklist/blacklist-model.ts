import { pool } from '../../connection/bd';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { addTokenBlackList, searchTokenBlacklist } from '../../queries/blacklist-query';

const promisePool = pool.promise();

/**
 * Agrega un token a la lista negra
 */
const addToken = async (
    jti: string, 
    block_type: string, 
    expires_at: string, 
    reason: string
): Promise<ResultSetHeader> => {
    try {
        const query = addTokenBlackList(); 

        const [result] = await promisePool.execute<ResultSetHeader>(query, [
            jti, 
            block_type, 
            expires_at, 
            reason
        ]);

        return result;
    } catch (error) {
        
        console.error("Error al añadir token a la blacklist:", error);
        throw new Error("No se pudo invalidar el token.");
    }
}

/**
 * Busca un token en la lista negra
 */
const findTokenBlacklist = async (jti: string): Promise<any | null> => {
    const query = searchTokenBlacklist();

    const [rows] = await promisePool.execute<RowDataPacket[]>(query, [jti]);

    return rows.length > 0 ? rows[0] : null;
}

export { addToken, findTokenBlacklist }