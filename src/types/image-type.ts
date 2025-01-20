import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

interface ImageInterface {
  id: string;
  relatedId: string;
  relatedType: string;
  url: string;
}

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}



interface CloudImageUpload{
  imagePaths: string[],
  folderName: string,
  publicIds: string[],
}

export { ImageInterface, CloudinaryConfig , CloudImageUpload};
