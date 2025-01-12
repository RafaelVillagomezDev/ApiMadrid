import { RestaurantInterface } from 'restaurant-type';
import {Restaurant} from '../models/restaurant/restaurant-model';
class RestaurantFactory {
  static async createRestaurant(obj: RestaurantInterface) {
    try {

      const restaurant=new Restaurant(obj)
      const rows=await restaurant.createRestaurant()
      
      return rows
    } catch (error:any) {
      
      throw new Error('No se pudo crear el restaurante. No se afectaron filas.')

      
    }
  }
}
export { RestaurantFactory};
