const createDish = (): string => {
  const query = `
    INSERT INTO DISHES (id, restaurant_id, menu_id, name, description, price, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return query;
};

export { createDish };