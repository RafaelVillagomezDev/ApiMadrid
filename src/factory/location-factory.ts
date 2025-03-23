import { LocationInterface } from 'location-type';
import { Location } from '../models/location/location-model';

class LocationFactory {
  static async createLocation(obj: LocationInterface) {
    const objLocation={
     ...obj,
    longitud:"",
    latitid:""
    }

    
    const location = new Location(objLocation);
   
  }
}
export { LocationFactory };
