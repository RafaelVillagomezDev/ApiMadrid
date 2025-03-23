const existLocation = (): string => {
    const query = 'SELECT * FROM `location` WHERE `id` = ?;';
    return query;
  };
  
  const createLocation = (): string => {
    const query = `INSERT IGNORE INTO location (id,relatedId,relatedType,address,latitude,longitude,town,country,county) VALUES (?, ?, ?, ?,?,?,?,?,?);`;
    return query;
  };
  export { existLocation , createLocation };
  