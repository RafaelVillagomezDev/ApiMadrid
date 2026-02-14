import { RestaurantQueryPagination } from 'restaurant-type';

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

const getRestaurantData = ({
  id,
  name,
  address,
  limit,
  offset,
}: any): [string, any[]] => {
  const conditions: string[] = [];
  const filterValues: any[] = [];

  if (id) {
    conditions.push(`id = ?`);
    filterValues.push(id);
  }

  if (name) {
    conditions.push(`name LIKE ?`);
    filterValues.push(`%${name}%`);
  }

  if (address) {
    conditions.push(`address LIKE ?`);
    filterValues.push(`%${address}%`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // 🔒 Conversión segura
  const safeLimit =
    Number.isInteger(Number(limit)) && Number(limit) >= 0 ? Number(limit) : 10;

  const safeOffset =
    Number.isInteger(Number(offset)) && Number(offset) >= 0
      ? Number(offset)
      : 0;

  const query = `
    SELECT 
      r.id AS restaurant_id,
      r.name AS restaurant_name,
      r.email AS restaurant_email,
      r.address AS restaurant_address,
      r.description AS restaurant_description,
      r.phone AS restaurant_phone,
      r.type_food AS restaurant_type_food,
      r.web AS restaurant_web,
      images.id AS image_id,
      images.url AS image_url,
      location.id AS location_id,
      location.address AS location_address,
      location.latitude AS location_latitude,
      location.longitude AS location_longitude,
      location.country AS location_country,
      location.county AS location_county,
      menu.id AS menu_id,
      menu.name AS menu_name,
      menu.description AS menu_description,
      dishes.id AS dish_id,
      dishes.name AS dish_name,
      dishes.description AS dish_description,
      dishes.price AS dish_price,
      dishes.category AS dish_category
    FROM (
      SELECT id 
      FROM restaurant 
      ${whereClause}
      ORDER BY id ASC 
      LIMIT ?, ?
    ) AS ids
    INNER JOIN restaurant r ON ids.id = r.id
    LEFT JOIN images ON r.id = images.relatedId
    LEFT JOIN location ON r.id = location.relatedId
    LEFT JOIN menu ON r.id = menu.restaurant_id
    LEFT JOIN dishes ON menu.id = dishes.menu_id
    ORDER BY r.id ASC, menu.id ASC, dishes.id ASC;
  `;

  // ⚠ IMPORTANTE: offset primero, luego limit
  const values = [...filterValues, safeOffset, safeLimit];

  return [query.trim(), values];
};

const formatRestaurantData = (rows: any[]) => {
  const restaurantsMap = new Map();

  for (const row of rows) {
    if (!restaurantsMap.has(row.restaurant_id)) {
      restaurantsMap.set(row.restaurant_id, {
        id: row.restaurant_id,
        name: row.restaurant_name,
        email: row.restaurant_email,
        address: row.restaurant_address,
        description: row.restaurant_description,
        phone: row.restaurant_phone,
        type_food: row.restaurant_type_food,
        web: row.restaurant_web,
        images: row.image_id ? [{ id: row.image_id, url: row.image_url }] : [],
        location: row.location_id
          ? {
              id: row.location_id,
              address: row.location_address,
              latitude: row.location_latitude,
              longitude: row.location_longitude,
              country: row.location_country,
              county: row.location_county,
            }
          : null,
        menus: [],
      });
    }

    const restaurant = restaurantsMap.get(row.restaurant_id);

    // Agrupar imágenes (opcional si hay varias)
    if (
      row.image_id &&
      !restaurant.images.find((img: any) => img.id === row.image_id)
    ) {
      restaurant.images.push({ id: row.image_id, url: row.image_url });
    }

    // Buscar si el menú ya está agregado
    let menu = restaurant.menus.find((m: any) => m.id === row.menu_id);

    if (!menu && row.menu_id) {
      menu = {
        id: row.menu_id,
        name: row.menu_name,
        description: row.menu_description,
        dishes: [],
      };
      restaurant.menus.push(menu);
    }

    // Agregar plato si existe
    if (
      menu &&
      row.dish_id &&
      !menu.dishes.find((d: any) => d.id === row.dish_id)
    ) {
      menu.dishes.push({
        id: row.dish_id,
        name: row.dish_name,
        description: row.dish_description,
        price: row.dish_price,
        category: row.dish_category,
      });
    }
  }

  return Array.from(restaurantsMap.values());
};

const removeRestaurantsData = (): string => {
  const query = `DELETE FROM restaurant WHERE id = ?;`;
  return query;
};

export {
  createRestaurant,
  existRestaurant,
  isRestaurant,
  getRestaurantData,
  formatRestaurantData,
  removeRestaurantsData,
};
