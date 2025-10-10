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


const getRestaurantData = ({
  id,
  name,
  address,
  limit = 20,
  offset = 0
}: RestaurantQueryPagination): [string, any[]] => {
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
      location.county AS location_county,

      menu.id AS menu_id,
      menu.name AS menu_name,
      menu.description AS menu_description,

      dishes.id AS dish_id,
      dishes.name AS dish_name,
      dishes.description AS dish_description,
      dishes.price AS dish_price,
      dishes.category AS dish_category

    FROM restaurant
    LEFT JOIN images ON restaurant.id = images.relatedId
    LEFT JOIN location ON restaurant.id = location.relatedId
    LEFT JOIN menu ON restaurant.id = menu.restaurant_id
    LEFT JOIN dishes ON menu.id = dishes.menu_id
  `;

  const conditions: string[] = [];
  const values: any[] = [];

  if (id) {
    conditions.push(`restaurant.id = ?`);
    values.push(id);
  }

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

  query += ` ORDER BY restaurant.id LIMIT ? OFFSET ?`;
  values.push(Number(limit), Number(offset));

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
              county: row.location_county
            }
          : null,
        menus: []
      });
    }

    const restaurant = restaurantsMap.get(row.restaurant_id);

    // Agrupar imágenes (opcional si hay varias)
    if (row.image_id && !restaurant.images.find((img: any) => img.id === row.image_id)) {
      restaurant.images.push({ id: row.image_id, url: row.image_url });
    }

    // Buscar si el menú ya está agregado
    let menu = restaurant.menus.find((m: any) => m.id === row.menu_id);

    if (!menu && row.menu_id) {
      menu = {
        id: row.menu_id,
        name: row.menu_name,
        description: row.menu_description,
        dishes: []
      };
      restaurant.menus.push(menu);
    }

    // Agregar plato si existe
    if (menu && row.dish_id && !menu.dishes.find((d: any) => d.id === row.dish_id)) {
      menu.dishes.push({
        id: row.dish_id,
        name: row.dish_name,
        description: row.dish_description,
        price: row.dish_price,
        category: row.dish_category
      });
    }
  }

  return Array.from(restaurantsMap.values());
};


const removeRestaurantsData = (): string => {
  const query = `DELETE FROM restaurant WHERE id = ?;`;
  return query;
};





export { createRestaurant, existRestaurant, isRestaurant,getRestaurantData ,formatRestaurantData,removeRestaurantsData};
