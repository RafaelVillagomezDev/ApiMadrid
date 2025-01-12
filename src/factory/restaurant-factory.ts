import { RestaurantInterface } from 'restaurant-type';
import { Restaurant } from '../models/restaurant/restaurant-model';

class RestaurantFactory {
  static async createRestaurant(obj: RestaurantInterface) {
    const restaurant = new Restaurant(obj);
    await restaurant.existRestaurant();
    const rows = await restaurant.createRestaurant();
    return rows;
  }
}
export { RestaurantFactory };
