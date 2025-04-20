import { RestaurantQueryInterface } from "restaurant-type";

const createRestaurant = (): string => {
  const query = `INSERT IGNORE INTO RESTAURANT (id,email,name,address,description) VALUES (?, ?, ?, ?,?);`;
  return query;
};

const existRestaurant = (): string => {
  const query = 'SELECT * FROM `restaurant` WHERE `email` = ?;';
  return query;
};
const isRestaurant = (): string => {
  const query = 'SELECT id FROM restaurant WHERE id = ?';
  return query;
};

const getRestaurantData = ({ name, address }: RestaurantQueryInterface): [string, any[]] => {
  let query = `SELECT * FROM restaurant`;
  const conditions: string[] = [];
  const values: any[] = [];

  if (name) {
    conditions.push(`name LIKE ?`);
    values.push(`%${name}%`);
  }

  if (address) {
    conditions.push(`address LIKE ?`);
    values.push(`%${address}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  return [query, values];
};

export { createRestaurant, existRestaurant, isRestaurant,getRestaurantData };
