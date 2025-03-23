

import { LocationInterface } from 'location-type';
import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';
import {
  existLocation,createLocation
} from '../../queries/location-query';
// Obtener el pool de promesas
const promisePool = pool.promise();

class Location implements LocationInterface{
  relatedId: string;
  id:string;
  latitude:string;
  longitude:string;
  address:string;
  town: string;
  country: string;
  county: string;
  relatedType: string;
  
  

  constructor({ relatedId,id,latitude,longitude,address,country,county,town,relatedType}: LocationInterface) {
    this.relatedId = relatedId;
    this.id=id;
    this.latitude=latitude;
    this.longitude=longitude;
    this.address=address;
    this.country=country;
    this.county=county;
    this.town=town;
    this.relatedType=relatedType;
  }


  
// Tengo que comprobar que exista en la tabla que le tengo que pasar de relatedType y el id 
  async existLocation(): Promise<number> {
    const queryExist = existLocation();

    // Ejecutar la consulta usando el pool de promesas
    const [rows]: [any[], any] = await promisePool.query(queryExist, [
      this.id,
    ]);

    if (rows.length > 0) {
      throw new Error('Ya existe esa localizacion asociada a un elemento en nuestra bbdd');
    }

    return rows.length;
  }

  async createLocation(): Promise<number> {
    const queryCreate = createLocation();

    // Ejecutar la consulta usando el pool de promesas
    const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
      this.id,
      this.relatedId,
      this.relatedType,
      this.address,
      this.latitude,
      this.longitude,
      this.town,
      this.country,
      this.county
    ]);

    if (result.affectedRows === 0) {
      throw new Error('No se pudo crear el restaurante ');
    }

    return result.affectedRows;
  }

 
}

export {Location };
