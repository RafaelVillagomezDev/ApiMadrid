import ImageController from '../../controllers/image-controller';
import express, { Router } from 'express';
import { ImageSchema } from '../../schemas/image-schema';
import { upload } from '../../utils/multer';
import { processAndUploadImageFlexible } from '../../utils/sharp';

const router: Router = express.Router();

router.post(
  '/create/:relatedType/:relatedId',
  ImageSchema.create,
  upload.array('images'),
  processAndUploadImageFlexible,
  ImageController.createImage,
);

export default router;
