interface FormatBatchInput {
  restaurantsRows: any[];
  imagesRows: any[];
  paymentsRows: any[];
  menusAndDishesRows: any[];
}



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



const countTotalRestaurants = ({
  id,
  name,
  address,
  type_food,
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


  if (type_food) {
    const foodArray = Array.isArray(type_food)
      ? type_food.filter(t => t !== null && t !== undefined && String(t).trim() !== "")
      : [type_food].filter(t => t !== null && t !== undefined && String(t).trim() !== "");

    if (foodArray.length > 0) {
      const placeholders = foodArray.map(() => 'LOWER(?)').join(', ');
      conditions.push(`LOWER(type_food) IN (${placeholders})`);


      foodArray.forEach(t => filterValues.push(String(t).trim().toLowerCase()));
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT COUNT(DISTINCT id) AS total 
    FROM restaurant 
    ${whereClause};
  `;

  return [query.trim(), filterValues];
};


const getRestaurantData = ({
  id,
  name,
  address,
  type_food,
  limit,
  page,
}: any) => {
  const conditions: string[] = [];
  const filterValues: any[] = [];

  if (id) { conditions.push(`r.id = ?`); filterValues.push(id); }
  if (name) { conditions.push(`r.name LIKE ?`); filterValues.push(`%${name}%`); }
  if (address) { conditions.push(`r.address LIKE ?`); filterValues.push(`%${address}%`); }

  if (type_food) {
    const foodArray = Array.isArray(type_food)
      ? type_food.filter(t => t && String(t).trim() !== "")
      : [type_food].filter(t => t && String(t).trim() !== "");

    if (foodArray.length > 0) {
      const placeholders = foodArray.map(() => 'LOWER(?)').join(', ');
      conditions.push(`LOWER(r.type_food) IN (${placeholders})`);
      foodArray.forEach(t => filterValues.push(String(t).trim().toLowerCase()));
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // 🔥 Calculamos el limit y la página de forma segura
  const safeLimit = Math.max(1, parseInt(limit) || 6); // Mínimo 1 para evitar errores de división
  const safePage = Math.max(1, parseInt(page) || 1);

  // 🔥 Convertimos la página en el Offset que necesita MySQL
  const safeOffset = (safePage - 1) * safeLimit;

  const restaurantBaseQuery = `
    SELECT 
      r.id AS restaurant_id, r.name AS restaurant_name, r.email AS restaurant_email,
      r.address AS restaurant_address, r.description AS restaurant_description,
      r.phone AS restaurant_phone, r.type_food AS restaurant_type_food, r.web AS restaurant_web,
      l.id AS location_id, l.address AS location_address, l.latitude AS location_latitude,
      l.longitude AS location_longitude, l.country AS location_country, l.county AS location_county
    FROM restaurant r
    LEFT JOIN location l ON r.id = l.relatedId
    ${whereClause}
    ORDER BY r.id ASC 
    LIMIT ?, ?;
  `.trim();

  // El array de valores inyecta el offset calculado y el limit
  const baseValues = [...filterValues, safeOffset, safeLimit];

  const imagesQuery = `SELECT id AS image_id, url AS image_url, relatedId FROM images WHERE relatedId IN (?);`;
  const paymentsQuery = `
    SELECT rp.restaurant_id, mp.id AS payment_method_id, mp.name AS payment_method_name, mp.icon_url AS payment_method_icon
    FROM RESTAURANT_PAYMENTS rp
    INNER JOIN METHODS_PAYMENT mp ON rp.method_payment_id = mp.id
    WHERE rp.restaurant_id IN (?);
  `.trim();
  const menusAndDishesQuery = `
    SELECT m.restaurant_id, m.id AS menu_id, m.name AS menu_name, m.description AS menu_description,
           d.id AS dish_id, d.name AS dish_name, d.description AS dish_description, d.price AS dish_price, d.category AS dish_category
    FROM menu m
    LEFT JOIN dishes d ON m.id = d.menu_id
    WHERE m.restaurant_id IN (?)
    ORDER BY m.id ASC, d.id ASC;
  `.trim();

  return {
    restaurantBaseQuery,
    baseValues,
    imagesQuery,
    paymentsQuery,
    menusAndDishesQuery,
    safeLimit,
    safePage
  };
};



const formatRestaurantData = ({
  restaurantsRows,
  imagesRows,
  paymentsRows,
  menusAndDishesRows
}: FormatBatchInput): any[] => {

  const restaurantsMap = new Map();

  //  Inicializamos los restaurantes basándonos en la query base principal
  for (const row of restaurantsRows) {
    restaurantsMap.set(row.restaurant_id, {
      id: row.restaurant_id,
      name: row.restaurant_name,
      email: row.restaurant_email,
      address: row.restaurant_address,
      description: row.restaurant_description,
      phone: row.restaurant_phone,
      type_food: row.restaurant_type_food,
      web: row.restaurant_web,
      images: [],
      payment_methods: [], // Agregamos la nueva clave para métodos de pago
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

  // Inyectamos las imágenes directamente a su respectivo restaurante (O(1) lookup)
  for (const img of imagesRows) {
    const restaurant = restaurantsMap.get(img.relatedId);
    if (restaurant && img.image_id) {
      restaurant.images.push({
        id: img.image_id,
        url: img.image_url
      });
    }
  }

  //  Inyectamos los métodos de pago directamente (O(1) lookup)
  for (const pm of paymentsRows) {
    const restaurant = restaurantsMap.get(pm.restaurant_id);
    if (restaurant && pm.payment_method_id) {
      restaurant.payment_methods.push({
        id: pm.payment_method_id,
        name: pm.payment_method_name,
        icon_url: pm.payment_method_icon
      });
    }
  }


  // Para evitar buscar dentro del array de menús repetidamente, usamos un Map temporal para los menús
  const menusMap = new Map();

  for (const row of menusAndDishesRows) {
    const restaurant = restaurantsMap.get(row.restaurant_id);
    if (!restaurant || !row.menu_id) continue;

    // Si el menú no se ha creado en el mapa de menús temporales, lo creamos
    if (!menusMap.has(row.menu_id)) {
      const newMenu = {
        id: row.menu_id,
        name: row.menu_name,
        description: row.menu_description,
        dishes: [],
      };

      menusMap.set(row.menu_id, newMenu);
      restaurant.menus.push(newMenu); // Se pasa por referencia, por lo que se actualizará automáticamente
    }

    const currentMenu = menusMap.get(row.menu_id);

    // Si la fila contiene un plato válido, se añade al menú actual directamente
    if (row.dish_id) {
      currentMenu.dishes.push({
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
  countTotalRestaurants
};
