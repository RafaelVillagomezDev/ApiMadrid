import ImageController from '../../controllers/image-controller';
import express, { Router } from 'express';
import { ImageSchema } from '../../schemas/image-schema';
import { upload } from '../../utils/multer';

const router: Router = express.Router();

router.post(
  '/create/:relatedType/:relatedId',
  ImageSchema.create,
  upload.array("images"),
  ImageController.createImage,
);

export default router;
