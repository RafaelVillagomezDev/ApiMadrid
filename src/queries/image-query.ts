const createImage = (): string => {
  return 'INSERT INTO `images` (`id`, `relatedId`, `relatedType`, `url`) VALUES (?, ?, ?, ?);';
};

const existImage = (): string => {
  return 'SELECT 1 FROM `images` WHERE `id` = ? LIMIT 1;';
};

export { createImage, existImage };