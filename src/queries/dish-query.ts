const createDish = (): string => {
  const query = `
    INSERT INTO dishes (id, restaurant_id, menu_id, name, description, price, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return query;
};

export { createDish };