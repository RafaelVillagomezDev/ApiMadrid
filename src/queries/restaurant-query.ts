const createRestaurant = (): string => {
  const query = `INSERT IGNORE INTO RESTAURANT (id,email,name,address,description) VALUES (?, ?, ?, ?,?);`;
  return query;
};

const existRestaurant = (): string => {
  const query = 'SELECT * FROM `restaurant` WHERE `email` = ?;';
  return query;
};
const isRestaurant=(): string => {
  const query = 'SELECT id FROM restaurant WHERE id = ?';
  return query;
};


export { createRestaurant, existRestaurant ,isRestaurant };
