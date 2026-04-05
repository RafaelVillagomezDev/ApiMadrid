const existLocation = (): string => {
  const query = 'SELECT * FROM `location` WHERE `relatedId` = ?;';
  return query;
};

const createLocation = (): string => {
  const query = `INSERT IGNORE INTO location (id,relatedId,relatedType,address,latitude,longitude,town,country,county) VALUES (?, ?, ?, ?,?,?,?,?,?);`;
  return query;
};

const getLocation = (): string => {
  const query = `SELECT *
  FROM location WHERE relatedId = ? 
   `;
  return query;
};

export { existLocation, createLocation, getLocation };
