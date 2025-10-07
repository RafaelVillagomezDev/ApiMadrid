import { LocationInterface } from 'location-type';
import { Location } from '../models/location/location-model';

class LocationFactory {
  static async createLocation(obj: LocationInterface) {
    const location = new Location(obj);
    await location.existLocation();
    const rows = await location.createLocation();
    return rows;
  }

  static async getLocation(obj: LocationInterface){
    const location = new Location(obj);
    const rows = await location.getLocation()
    return rows;
  }
}
export { LocationFactory };
