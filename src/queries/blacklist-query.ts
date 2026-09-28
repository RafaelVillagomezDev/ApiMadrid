const addTokenBlackList = (): string => {
  const query = `INSERT INTO blacklistEntry (value, type, expires_at, reason) VALUES (?, ?, ?, ?)`;
  return query;
};

const searchTokenBlacklist = (): string => {
  const query = `SELECT value FROM blacklistEntry WHERE value = ? LIMIT 1`;
  return query;
};

export { addTokenBlackList, searchTokenBlacklist };
