import { Dish } from '../models/dish/dish-model';
import { DishInterface } from '../types/dish-type';

class DishFactory {
  static async createDishes(dishesData: DishInterface[]): Promise<number> {
   
    return await Dish.createDishes(dishesData);
  }
}
export { DishFactory };