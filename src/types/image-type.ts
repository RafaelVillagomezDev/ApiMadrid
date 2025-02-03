import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

interface ImageInterface {
  id: string;
  relatedId: string;
  relatedType: string;
  url: string[];
}

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

interface MulterFile {
  fieldname: string; // Nombre del campo en el formulario
  originalname: string; // Nombre original del archivo
  encoding: string; // Codificación del archivo
  mimetype: string; // Tipo MIME del archivo
  size: number; // Tamaño del archivo en bytes
  buffer: Buffer; // Contenido del archivo en un buffer
  destination?: string; // Directorio donde se guarda (opcional)
  files: ArrayBuffer;
  filename?: string; // Nombre del archivo en el almacenamiento (opcional)
  path?: string; // Ruta completa al archivo (opcional)
}

interface CloudImageUpload {
  imagePaths: string[];
  folderName: string;
  publicIds: string[];
}

export { ImageInterface, CloudinaryConfig, CloudImageUpload, MulterFile };
