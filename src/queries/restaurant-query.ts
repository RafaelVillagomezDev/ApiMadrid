const createRestaurant = (): string => {
  const query = `INSERT IGNORE INTO RESTAURANT (Id,Email,Name,Address,Description) VALUES (?, ?, ?, ?,?);`;
  return query;
};

const existRestaurant = (): string => {
  const query = 'SELECT * FROM `restaurant` WHERE `email` = ?;';
  return query;
};

export { createRestaurant, existRestaurant };
