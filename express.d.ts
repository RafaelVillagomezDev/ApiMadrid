declare global {
  namespace Express {
    interface Multer {
      File: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        path?: string;
      };
    }
    interface Request {
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

// Obligatorio para que TypeScript lo reconozca como un módulo de declaraciones globales
export {};