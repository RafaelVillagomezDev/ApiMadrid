"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_controller_1 = __importDefault(require("../../controllers/image-controller"));
const express_1 = __importDefault(require("express"));
const image_schema_1 = require("../../schemas/image-schema");
const multer_1 = require("../../utils/multer");
const sharp_1 = require("../../utils/sharp");
const auth_token_1 = require("../../middleware/auth-token");
const verify_token_blacklist_1 = require("../../middleware/verify-token-blacklist");
const router = express_1.default.Router();
router.post('/create/:relatedType/:relatedId', image_schema_1.ImageSchema.create, auth_token_1.authToken, verify_token_blacklist_1.checkBlacklist, multer_1.upload.array('images'), sharp_1.processAndUploadImageFlexible, image_controller_1.default.createImage);
exports.default = router;
