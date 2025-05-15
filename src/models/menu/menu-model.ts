import { createMenu } from '../../queries/menu-query';
import { pool } from '../../connection/bd';
import { MenuInterface } from 'menu-types';
import { ResultSetHeader } from 'mysql2';

const promisePool = pool.promise();

class Menu implements MenuInterface {
  id?: string;
  restaurant_id?: string;
  dish_name?: string;
  description?: string; 
  price?: number;
  category?: string;

  constructor({
    id,
    restaurant_id,
    dish_name,
    description,
    price,
    category
  }: MenuInterface) {
   
    this.id = id;
    this.restaurant_id = restaurant_id;
    this.dish_name = dish_name;
    this.description = description;
    this.price = price;
    this.category = category;
  }

  async createMenu(): Promise<number> {
    try {
      const queryCreate = createMenu();
      const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
        this.id,
        this.restaurant_id,
        this.dish_name,
        this.description,
        this.price,
        this.category
      ]);

      if (result.affectedRows === 0) {
        throw new Error('No se pudo crear el menú');
      }

      return result.affectedRows;
    } catch (err) {
      console.error('Error al crear el menú:', err);
      throw err;
    }
  }
}

export { Menu };
