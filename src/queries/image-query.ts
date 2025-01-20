const createImage = (): string => {
  const query = `INSERT INTO IMAGES (Id, RelatedId, RelatedType, Url) VALUES (?, ?, ?, ?)`;
  return query;
};

const existImage = (): string => {
  const query = 'SELECT * FROM `images` WHERE `id` = ?;';
  return query;
};

export { createImage, existImage };
