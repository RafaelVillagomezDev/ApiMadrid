import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (
  !process.env.CLOUDNAME ||
  !process.env.APIKEYCLOUDINARY ||
  !process.env.APISECRETCLOUDINARY
) {
  throw new Error('Variables de entorno vacías');
}

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: process.env.CLOUDNAME!,
  api_key: process.env.APIKEYCLOUDINARY!,
  api_secret: process.env.APISECRETCLOUDINARY!,
};

cloudinary.config(cloudinaryConfig);

async function uploadMultipleImages(
  imagePaths: string[],
  folderName: string,
  publicIds: string[],
): Promise<any[]> {
  try {
    const uploadPromises = imagePaths.map((imagePath, index) => {
      return cloudinary.uploader.upload(imagePath, {
        folder: folderName,
        public_id: publicIds[index],
        overwrite: true,
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const response = uploadResults.map((uploadResult) => ({
      asset_id: uploadResult.asset_id,
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      created_at: uploadResult.created_at,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      folder: uploadResult.folder,
    }));

    console.log('Imágenes subidas con éxito:', response);
    return response;
  } catch (error) {
    console.error('Error al subir las imágenes a Cloudinary:', error);
    throw error;
  }
}

export { uploadMultipleImages };
