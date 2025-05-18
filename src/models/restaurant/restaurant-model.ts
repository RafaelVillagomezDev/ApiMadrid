import { RestaurantInterface, RestaurantQueryPagination } from 'restaurant-type';
import {
  createRestaurant,
  existRestaurant,
  formatRestaurantData,
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
  phone:string;
  type_food:string;
  web:string;

  constructor({ id, email, name, address, description,phone,type_food,web }: RestaurantInterface) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.address = address;
    this.description = description;
    this.phone=phone;
    this.type_food=type_food;
    this.web=web;
  }

   async createRestaurant():Promise<number> {
    const queryCreate = createRestaurant();
    const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
      this.id,
      this.email,
      this.name,
      this.address,
      this.description,
      this.phone,
      this.type_food,
      this.web
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

  static async getRestaurants(obj:RestaurantQueryPagination) {
    const {id,name,address,limit,offset}=obj;
    const [queryRestaurants, values] = getRestaurantData({
       id,
       name,
       address,
       limit,
       offset
    });

    
    const [rows]: [any[], any] = await promisePool.query(queryRestaurants,values);

    if (rows.length === 0) {
      throw new Error('No existen restaurantes con esas condiciones');
    }

    return formatRestaurantData(rows);
  }
}

export { Restaurant };
