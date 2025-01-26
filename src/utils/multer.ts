import multer from 'multer'
import path from 'path';
import fs from 'fs';

// Asegúrate de que el directorio exista
const ensureUploadDirectoryExists = () => {
  const dir = './uploads';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        ensureUploadDirectoryExists();
        cb(null, './uploads')
    },
    filename: (_req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `${Date.now()}.${ext}`)
    },
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Aceptar el archivo
    } else {
      cb(null, false); 
}
}

export const upload = multer({ storage: multerStorage,fileFilter: fileFilter })