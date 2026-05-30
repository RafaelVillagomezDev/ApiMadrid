
import { Dish } from '../models/dish/dish-model';
import { DishInterface } from '../types/dish-type';

class DishFactory {
  static async createDish(obj: DishInterface): Promise<number> {
    const dish = new Dish(obj);
    const rows = await dish.createDish();
    return rows;
  }
 
}
export { DishFactory };
