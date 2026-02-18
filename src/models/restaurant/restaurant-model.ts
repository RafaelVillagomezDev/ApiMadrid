import {
  RestaurantInterface,
  RestaurantQueryPagination,
} from 'restaurant-type';
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
  description?: Text;
  phone?: string;
  type_food?: string;
  web?: string;
  limit?: number | undefined;
  offset?: number | undefined;

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
    offset,
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
    this.offset = offset;
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
    const { id, name, address,type_food, limit, offset } = obj;
    const [queryRestaurants, values] = getRestaurantData({
      id,
      name,
      address,
      type_food,
      limit,
      offset,
    });

    const [queryCount, countValues] = countTotalRestaurants({ id, name,address,type_food });

    const [[rows], [countRows]]: [any[], any] = await Promise.all([
      promisePool.query(queryRestaurants, values),
      promisePool.query(queryCount, countValues)
    ]);

    if (!rows || rows.length === 0) {
      throw new Error('No existen restaurantes con esas condiciones');
    }

    const data = formatRestaurantData(rows);
    const total = countRows[0].total;
    
    
    return {
      "data":data,
      "total":total
    };
  }

  async removeRestaurants(): Promise<number> {
    const queryRemoveRestaurants = removeRestaurantsData();

    const [rows]: [any[], any] = await promisePool.query(
      queryRemoveRestaurants,
      [this.id],
    );

    if (rows.length === 0) {
      throw new Error('No existen restaurantes con esas condiciones');
    }

    return rows.length;
  }
}

export { Restaurant };
