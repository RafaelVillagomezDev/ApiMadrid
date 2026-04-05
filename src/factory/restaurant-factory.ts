import { RestaurantInterface } from '../types/restaurant-type';
import { Restaurant } from '../models/restaurant/restaurant-model';

class RestaurantFactory {
  static async createRestaurant(obj: RestaurantInterface):Promise<number> {
    const restaurant = new Restaurant(obj);
    await restaurant.existRestaurant();
    const rows = await restaurant.createRestaurant();
    return rows;
  }

  static async getRestaurant(obj: RestaurantInterface) {
    const restaurant = new Restaurant(obj);
    const rows = await restaurant.getRestaurants(restaurant);
    return rows;
  }

  static async removeRestaurant(obj: RestaurantInterface) {
    const restaurant = new Restaurant(obj);
    await restaurant.existRestaurant();
    const rows = await restaurant.removeRestaurants();
    return rows;
  }
}
export { RestaurantFactory };
