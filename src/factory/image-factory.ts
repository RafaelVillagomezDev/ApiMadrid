import { CloudImageUpload, ImageInterface } from 'image-type';
import { Image } from '../models/image/image-model';

class ImageFactory {
  static async createImage(obj: ImageInterface) {
    const image = new Image(obj);
    await image.existImage();
    const rows = await image.createImage();
    return rows;
  }
}
export { ImageFactory };
