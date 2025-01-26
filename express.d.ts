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
