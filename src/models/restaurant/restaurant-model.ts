import { RestaurantInterface } from 'restaurant-type';
import {
  createRestaurant,
  existRestaurant,
  getRestaurantData,
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

  constructor({ id, email, name, address, description }: RestaurantInterface) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.address = address;
    this.description = description;
  }

  async createRestaurant(): Promise<number> {
    const queryCreate = createRestaurant();
    const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
      this.id,
      this.email,
      this.name,
      this.address,
      this.description,
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

  async getRestaurants() {
    const [queryRestaurants, values] = getRestaurantData({
      name: this.name,
      address: this.address,
    });

    const [rows]: [any[], any] = await promisePool.query(queryRestaurants,values);

    if (rows.length === 0) {
      throw new Error('No existen restaurantes con esas condiciones');
    }

    return rows;
  }
}

export { Restaurant };
