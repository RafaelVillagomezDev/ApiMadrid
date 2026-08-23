const createRefreshTokenQuery = (): string => {

    const query = `
        INSERT INTO REFRESH_TOKENS (user_id, token, expires_at) 
        VALUES (?, ?, ?)
      `;
    return query;
}

const findValidTokenQuery = (): string => {

    const query = `
        SELECT * FROM REFRESH_TOKENS 
        WHERE token = ? AND expires_at > NOW()
      `;
      return query;
}

const deleteTokenByIdQuery = (): string => {
     const query = `DELETE FROM REFRESH_TOKENS WHERE id = ?`;
     return query;
}

const deleteAllTokensByUserQuery = (): string => {
     const query = `DELETE FROM REFRESH_TOKENS WHERE user_id = ?`;
        return query;
}

export { createRefreshTokenQuery, findValidTokenQuery, deleteTokenByIdQuery , deleteAllTokensByUserQuery};