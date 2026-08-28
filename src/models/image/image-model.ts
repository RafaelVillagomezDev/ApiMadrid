import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../connection/bd';
import { ImageInterface } from '../../types/image-type';
import { existImage, createImage } from '../../queries/image-query';

const promisePool = pool.promise();

class Image implements ImageInterface {
  id: string;
  relatedId: string;
  relatedType: string;
  url: string;

  constructor({ id, relatedId, relatedType, url }: ImageInterface) {
    this.id = id;
    this.relatedId = relatedId;
    this.relatedType = relatedType;
    this.url = url;
  }

  async createImage(): Promise<number> {

    const connection = await promisePool.getConnection();

    try {

      await connection.beginTransaction();

      const queryCreate = createImage();


      const [result] = await connection.query<ResultSetHeader>(queryCreate, [
        this.id,
        this.relatedId,
        this.relatedType,
        this.url,
      ]);

      if (result.affectedRows === 0) {
        throw new Error('No se pudo crear la imagen en la base de datos');
      }


      await connection.commit();

      return result.affectedRows;
    } catch (error) {
      
      await connection.rollback();
      throw error;
    } finally {

      connection.release();
    }
  }

  async existImage(): Promise<boolean> {
    const queryExist = existImage();


    const [rows] = await promisePool.query<RowDataPacket[]>(queryExist, [
      this.id,
    ]);

    return rows.length > 0;
  }
}

export { Image };