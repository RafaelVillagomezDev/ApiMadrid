import { createDish} from '../../queries/dish-query';
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


  constructor({ id, restaurant_id, menu_id, name, description, price, category }: DishInterface ){
    this.id = id;
    this.restaurant_id = restaurant_id ?? '';
    this.menu_id = menu_id ?? '';
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category as 'entrantes' | 'principal' | 'postres' | 'bebidas';
  }

  async createDish(): Promise<number> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      
      const [dishResult] = await conn.query<ResultSetHeader>(createDish(), [
        this.id,
        this.restaurant_id,
        this.menu_id,
        this.name,
        this.description,
        this.price,
        this.category
      ]);
      

      if (dishResult.affectedRows === 0) {
        throw new Error('No se pudo crear el plato');
      }

      

      await conn.commit();
      return dishResult.affectedRows;
    } catch (err: unknown) {
      await conn.rollback();
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error al crear el plato: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }
}

export { Dish };
