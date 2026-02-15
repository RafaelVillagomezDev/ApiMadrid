import ImageController from '../../controllers/image-controller';
import express, { Router } from 'express';
import { ImageSchema } from '../../schemas/image-schema';
import { upload } from '../../utils/multer';
import { processAndUploadImageFlexible } from '../../utils/sharp';
import { authToken } from '../../middleware/auth-token';
import { checkBlacklist } from '../../middleware/verify-token-blacklist';

const router: Router = express.Router();

router.post(
  '/create/:relatedType/:relatedId',
  ImageSchema.create,
  authToken,
  checkBlacklist,
  upload.array('images'),
  processAndUploadImageFlexible,
  ImageController.createImage,
);

export default router;
