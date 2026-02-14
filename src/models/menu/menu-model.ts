import { createDishes, createMenu } from '../../queries/menu-query';
import { pool } from '../../connection/bd';
import { DishInterface, MenuInterface } from 'menu-types';
import { ResultSetHeader } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

class Menu implements MenuInterface {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  dishes: DishInterface[];

  constructor({ id, restaurant_id, name, description, dishes }: MenuInterface) {
    this.id = id;
    this.restaurant_id = restaurant_id;
    this.name = name;
    this.description = description;
    this.dishes = dishes || [];
  }

  async createMenu(): Promise<number> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const queryCreateMenu = createMenu();
      const [menuResult] = await conn.query<ResultSetHeader>(queryCreateMenu, [
        this.id,
        this.restaurant_id,
        this.name,
        this.description || null,
      ]);

      if (menuResult.affectedRows === 0) {
        throw new Error('No se pudo crear el menú');
      }

      const queryCreateDish = createDishes();

      for (const dish of this.dishes) {
        const dishId = uuidv4();
        await conn.query<ResultSetHeader>(queryCreateDish, [
          dishId,
          this.id,
          dish.name,
          dish.description || null,
          dish.price,
          dish.category,
        ]);
      }

      await conn.commit();
      return menuResult.affectedRows;
    } catch (err) {
      await conn.rollback();

      throw new Error('Error al crear el menú:');
    } finally {
      conn.release();
    }
  }
}

export { Menu };
