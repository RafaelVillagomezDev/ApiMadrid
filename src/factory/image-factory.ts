import { CloudImageUpload, ImageInterface } from 'image-type';
import { Image } from '../models/image/image-model';
import { uploadMultipleImages } from '../utils/cloudinary';

class ImageFactory {
  static async createImage(obj: ImageInterface) {
    const image = new Image(obj);
    await image.existImage();
    const rows = await image.createImage();
    return rows;
  }
  static async uplodadImage({imagePaths,folderName,publicIds}:CloudImageUpload){
      uploadMultipleImages
  }
}
export { ImageFactory };
