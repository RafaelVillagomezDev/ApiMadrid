const createMenu = (): string => {
  const query = `INSERT INTO MENU (id, restaurant_id, name, description) VALUES (?, ?, ?, ?)`;
  return query;
};

const createDishes = (): string => {
  const query = `INSERT INTO DISHES (id, menu_id, name, description, price, category) VALUES (?, ?, ?, ?, ?, ?)`;
  return query;
};

export { createMenu, createDishes };
