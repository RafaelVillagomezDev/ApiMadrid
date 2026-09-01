import {
  RestaurantInterface,
  RestaurantQueryPagination,
} from '../../types/restaurant-type';
import {
  countTotalRestaurants,
  createRestaurant,
  existRestaurant,
  formatRestaurantData,
  getRestaurantData,
  removeRestaurantsData,
} from '../../queries/restaurant-query';
import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';

const promisePool = pool.promise();

class Restaurant implements RestaurantInterface {
  id?: string;
  email?: string;
  name?: string;
  address?: string;
  description?: string | Text;
  phone?: string;
  type_food?: string[];
  web?: string;
  limit?: number | undefined;
  page?: number | undefined; // 💡 Actualizado para mantener coherencia (antes offset)

  constructor({
    id,
    email,
    name,
    address,
    description,
    phone,
    type_food,
    web,
    limit,
    page, // 💡 Actualizado
  }: RestaurantInterface) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.address = address;
    this.description = description;
    this.phone = phone;
    this.type_food = type_food;
    this.web = web;
    this.limit = limit;
    this.page = page; 
  }

  async createRestaurant(): Promise<number> {
    const queryCreate = createRestaurant();
    const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
      this.id,
      this.email,
      this.name,
      this.address,
      this.description,
      this.phone,
      this.type_food,
      this.web,
    ]);

    if (result.affectedRows === 0) {
      throw new Error('No se pudo crear el restaurante');
    }

    return result.affectedRows;
  }

  async existRestaurant(): Promise<number> {
    const queryExist = existRestaurant();
    const [rows]: [any[], any] = await promisePool.query(queryExist, [
      this.email,
    ]);

    if (rows.length > 0) {
      throw new Error('Ya existe ese restaurante en nuestra bbdd');
    }

    return rows.length;
  }

  async getRestaurants(obj: RestaurantQueryPagination) {
    const { id, name, address, type_food, limit, page } = obj;

    // 💡 CORRECCIÓN 1: Pasamos 'page' en lugar de 'offset'
    const queries = getRestaurantData({
      id,
      name,
      address,
      type_food,
      limit,
      page, 
    });

    // Obtenemos la query de conteo total 
    const [queryCount, countValues] = countTotalRestaurants({ id, name, address, type_food });

    // Ejecutamos la query base principal de restaurantes y el conteo total en paralelo
    const [[restaurantsRows], [countRows]]: [any[], any] = await Promise.all([
      promisePool.query(queries.restaurantBaseQuery, queries.baseValues),
      promisePool.query(queryCount, countValues)
    ]);

    const total = countRows[0].total;

    // 💡 CORRECCIÓN 2: Salida temprana elegante sin romper la app
    if (!restaurantsRows || restaurantsRows.length === 0) {
      // Devolvemos data vacía para que el frontend maneje el "No hay resultados"
      return { data: [], total }; 
    }

    // Extraemos los IDs únicos de los restaurantes encontrados en esta página
    const restaurantIds = restaurantsRows.map((r: any) => r.restaurant_id);

    // Lanzamos las queries relacionales secundarias de forma simultánea (IN (?))
    const [[imagesRows], [paymentsRows], [menusAndDishesRows]]: [any[], any[], any[]] = await Promise.all([
      promisePool.query(queries.imagesQuery, [restaurantIds]),
      promisePool.query(queries.paymentsQuery, [restaurantIds]),
      promisePool.query(queries.menusAndDishesQuery, [restaurantIds])
    ]);

    // Pasamos todos los buffers de datos al nuevo formateador optimizado O(N)
    const data = formatRestaurantData({
      restaurantsRows,
      imagesRows,
      paymentsRows,
      menusAndDishesRows
    });
    
    return {
      data,
      total
    };
  }

  async removeRestaurants(): Promise<number> {
    const queryRemoveRestaurants = removeRestaurantsData();

    // Un DELETE devuelve ResultSetHeader, no un array de rows
    const [result] = await promisePool.query<ResultSetHeader>(
      queryRemoveRestaurants,
      [this.id],
    );

    if (result.affectedRows === 0) {
      throw new Error('No existen restaurantes con esas condiciones para eliminar');
    }

    return result.affectedRows;
  }
}

export { Restaurant };