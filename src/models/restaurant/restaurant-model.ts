import { RestaurantInterface } from 'restaurant-type';
import { createRestaurant } from "../../queries/restaurant-query";
import { pool } from "../../connection/bd";
import { ResultSetHeader } from 'mysql2';

// Obtener el pool de promesas
const promisePool = pool.promise();

class Restaurant {
  id: string;
  email: string;
  name: string;
  address: string;

  constructor({ id, email, name, address }: RestaurantInterface) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.address = address;
  }

  
  async createRestaurant(): Promise<number> {
    const queryCreate = createRestaurant(); 
    try {
      // Ejecutar la consulta usando el pool de promesas
      const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
        this.id,
        this.email,
        this.name,
        this.address,
      ]);

      if (result.affectedRows === 0) {
        throw new Error('No se pudo crear el restaurante ');
      }

      return result.affectedRows; 
    } catch (error: any) {
      
      throw new Error(`Error : ${error.message || 'Desconocido'}`); 
    }
  }
}

export { Restaurant };
