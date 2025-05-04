import { RestaurantQueryPagination } from "restaurant-type";

const createRestaurant = (): string => {
  const query = `INSERT IGNORE INTO RESTAURANT (id,email,name,address,description,phone,type_food,web) VALUES (?, ?, ?, ?,?,?,?,?);`;
  return query;
};

const existRestaurant = (): string => {
  const query = 'SELECT * FROM `restaurant` WHERE `email` = ?;';
  return query;
};
const isRestaurant = (): string => {
  const query = 'SELECT id FROM restaurant WHERE id = ?';
  return query;
};

const getRestaurantData = ({ name, address, limit = 20, offset = 0 }: RestaurantQueryPagination): [string, any[]] => {
  let query = `
    SELECT 
      restaurant.id AS restaurant_id,
      restaurant.name AS restaurant_name,
      restaurant.email AS restaurant_email,
      restaurant.address AS restaurant_address,
      restaurant.description AS restaurant_description,
      restaurant.phone AS restaurant_phone,
      restaurant.type_food AS restaurant_type_food,
      restaurant.web AS restaurant_web,
      images.id AS image_id,
      images.url AS image_url,
      location.id AS location_id,
      location.address AS location_address,
      location.latitude AS location_latitude,
      location.longitude AS location_longitude,
      location.country AS location_country,
      location.county AS location_county
    FROM restaurant
    LEFT JOIN images ON restaurant.id = images.relatedId
    LEFT JOIN location ON restaurant.id = location.relatedId
  `;

  const conditions: string[] = [];
  const values: any[] = [];

  if (name) {
    conditions.push(`restaurant.name LIKE ?`);
    values.push(`%${name}%`);
  }

  if (address) {
    conditions.push(`restaurant.address LIKE ?`);
    values.push(`%${address}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  // Añadir LIMIT y OFFSET
  query += ` ORDER BY restaurant.id LIMIT ? OFFSET ?`;
  values.push(Number(limit), Number(offset));

  return [query.trim(), values];
};



export { createRestaurant, existRestaurant, isRestaurant,getRestaurantData };
