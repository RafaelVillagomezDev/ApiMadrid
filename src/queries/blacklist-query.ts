const addTokenBlackList = (): string => {
  const query = `INSERT INTO blacklist_entry (value, type, expires_at, reason) VALUES (?, ?, ?, ?)`;
  return query;
};

const searchTokenBlacklist = (): string => {
  const query = `SELECT value FROM blacklist_entry WHERE value = ? LIMIT 1`;
  return query;
};

export { addTokenBlackList, searchTokenBlacklist };
