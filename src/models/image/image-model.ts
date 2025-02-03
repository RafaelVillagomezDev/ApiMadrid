import { ImageInterface } from 'image-type';
import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';
import { existImage, createImage } from '../../queries/image-query';

// Obtener el pool de promesas
const promisePool = pool.promise();

class Image {
  id: string;
  relatedId: string;
  relatedType: string;
  url: string[];

  constructor({ id, relatedId, relatedType, url }: ImageInterface) {
    this.id = id;
    this.relatedId = relatedId;
    this.relatedType = relatedType;
    this.url = url;
  }

  async createImage(): Promise<number> {
    const connection = await promisePool.getConnection(); 
    await connection.beginTransaction(); 
  
    try {
      const queryCreate = createImage(); 
  
      const [result] = await connection.query<ResultSetHeader>(queryCreate, [
        this.id,
        this.relatedId,
        this.relatedType,
        JSON.stringify(this.url), 
      ]);
  
      if (result.affectedRows === 0) {
        throw new Error('No se pudo crear la imagen');
      }
  
      await connection.commit(); 
      connection.release(); 
  
      return result.affectedRows;
    } catch (error) {
      await connection.rollback(); 
      connection.release(); 
      throw error; 
    }
  }

  async existImage(): Promise<number> {
    const queryExist = existImage();

    // Ejecutar la consulta usando el pool de promesas
    const [rows]: [any[], any] = await promisePool.query(queryExist, [this.id]);

    if (rows.length > 0) {
      throw new Error('Ya existe esa imagen en nuestra bbdd');
    }

    return rows.length;
  }
}

export { Image };
