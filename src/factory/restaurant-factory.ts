import { RestaurantInterface, RestaurantQueryInterface } from 'restaurant-type';
import { Restaurant } from '../models/restaurant/restaurant-model';

class RestaurantFactory {
  static async createRestaurant(obj: RestaurantInterface) {
    const restaurant = new Restaurant(obj);
    await restaurant.existRestaurant();
    const rows = await restaurant.createRestaurant();
    return rows;
  }

  static async getRestaurant(obj:RestaurantInterface){
    const restaurant = new Restaurant(obj);
    const data= await restaurant.getRestaurants();
    return data;
  }

}
export { RestaurantFactory };
