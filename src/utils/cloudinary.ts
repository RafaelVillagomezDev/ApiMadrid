import { v2 as cloudinary } from 'cloudinary';

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



const uploadImagesToCloudinary = async (file: Express.Multer.File) => {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (err, res) => {
      if (err) {
        reject(new Error('Error uploading image to Cloudinary: ' + err.message));
      } else {
        resolve(res?.secure_url || ''); 
      }
    });
  });
};
 
export { uploadImagesToCloudinary };
