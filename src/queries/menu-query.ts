const createMenu= (): string => {
    const query = `INSERT IGNORE INTO MENU (id,restaurant_id,dish_name,description,price,category) VALUES (?, ?, ?, ?,?,?);`;
    return query;
  };

export { createMenu};
