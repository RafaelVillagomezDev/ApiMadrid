const createMenu = (): string => {
  const query = `INSERT INTO menu (id, restaurant_id, name, description) VALUES (?, ?, ?, ?)`;
  return query;
};

const createDishes = (): string => {
  const query = `INSERT INTO dishes (id, menu_id, name, description, price, category) VALUES (?, ?, ?, ?, ?, ?)`;
  return query;
};

const isMenu= (): string => {
  const query = `SELECT EXISTS(SELECT 1 FROM menu WHERE id = ?) AS "exists"`;
  return query;
};


export { createMenu, createDishes ,isMenu };
