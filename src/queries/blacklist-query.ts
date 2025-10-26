const checkBlacklist = (): string => {
    const query = `SELECT * FROM BlacklistEntry 
WHERE value = ? 
  AND type = ? 
  AND (expires_at IS NULL OR expires_at > NOW());`;
    return query;
}


export { checkBlacklist };
