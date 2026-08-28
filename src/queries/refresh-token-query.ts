const createRefreshTokenQuery = (): string => {
  return 'INSERT INTO `refresh_tokens` (`user_id`, `token`, `expires_at`) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY));';
};

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