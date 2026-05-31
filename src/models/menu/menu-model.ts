import { createMenu } from '../../queries/menu-query';
import { pool } from '../../connection/bd';
import { MenuInterface } from '../../types/menu-types';
import { ResultSetHeader } from 'mysql2';


class Menu implements MenuInterface {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;

  constructor({ id, restaurant_id, name, description }: MenuInterface) {
    this.id = id;
    this.restaurant_id = restaurant_id;
    this.name = name;
    this.description = description;
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
     
      await conn.commit();
      return menuResult.affectedRows;
    } catch (err: unknown) {
      await conn.rollback();
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      throw new Error(`Error al crear el menú: ${errorMessage}`);
    } finally {
      conn.release();
    }
  }
}

export { Menu };
