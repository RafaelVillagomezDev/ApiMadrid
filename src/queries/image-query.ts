const createImage = (): string => {
  const query = `INSERT INTO IMAGES (id, relatedId, relatedType, url) VALUES (?, ?, ?, ?)`;
  return query;
};

const existImage = (): string => {
  const query = 'SELECT * FROM `images` WHERE `id` = ?;';
  return query;
};

export { createImage, existImage };
