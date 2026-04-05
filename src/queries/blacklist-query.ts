const addTokenBlackList = (): string => {
  const query = `INSERT INTO BlacklistEntry (value, type, expires_at, reason) VALUES (?, ?, ?, ?)`;
  return query;
};

const searchTokenBlacklist = (): string => {
  const query = `SELECT value FROM BlacklistEntry WHERE value = ? LIMIT 1`;
  return query;
};

export { addTokenBlackList, searchTokenBlacklist };
