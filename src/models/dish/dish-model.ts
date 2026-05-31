import { createDish } from '../../queries/dish-query';
import { pool } from '../../connection/bd';
import { DishInterface } from '../../types/dish-type';
import { ResultSetHeader } from 'mysql2';

class Dish implements DishInterface {
  id: string;
  restaurant_id: string;
  menu_id?: string;
  name: string;
  price: number;
  description: string;
  category: 'entrantes' | 'principal' | 'postres' | 'bebidas';

  constructor({ id, restaurant_id, menu_id, name, description, price, category }: DishInterface) {
    this.id = id;
    this.restaurant_id = restaurant_id ?? '';
    this.menu_id = menu_id ?? '';
    this.name = name;
    this.description = description ?? '';
    this.price = price;
    this.category = category as 'entrantes' | 'principal' | 'postres' | 'bebidas';
  }


  static async createDishes(dishesData: DishInterface[]): Promise<number> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();
      let totalAffectedRows = 0;


      for (const data of dishesData) {
        const [result] = await conn.query<ResultSetHeader>(createDish(), [
          data.id,
          data.restaurant_id,
          data.menu_id ?? null,
          data.name,
          data.description ?? null,
          data.price,
          data.category
        ]);

        if (result.affectedRows === 0) {
          throw new Error(`No se pudo crear el plato: ${data.name}`);
        }

        totalAffectedRows += result.affectedRows;
      }

      await conn.commit();
      return totalAffectedRows;
    } catch (err: unknown) {
      await conn.rollback();
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error en la transacción de platos: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }

  async createDish(): Promise<number> {
    return Dish.createDishes([this]);
  }
}

export { Dish };