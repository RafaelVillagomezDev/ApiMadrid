

import { LocationInterface } from 'location-type';
import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';

// Obtener el pool de promesas
const promisePool = pool.promise();

class Location implements LocationInterface{
  id_location: string;
  id:string;
  latitud:string;
  longitud:string;
  address:string;
  
  

  constructor({ id_location,id,latitud,longitud,address}: LocationInterface) {
    this.id_location = id_location;
    this.id=id;
    this.latitud=latitud;
    this.longitud=longitud;
    this.address=address;
  }

 
}

export {Location };
