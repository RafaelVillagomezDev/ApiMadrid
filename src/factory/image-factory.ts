import { ImageInterface } from '../types/image-type';
import { Image } from '../models/image/image-model';

class ImageFactory {
  static async createImage(obj: ImageInterface): Promise<number> {
    const image = new Image(obj);

    const exists = await image.existImage();
    if (exists) {
      throw new Error('La imagen ya existe en la base de datos');
    }
    const rows = await image.createImage();
    
    return rows;
  }
}

export { ImageFactory };