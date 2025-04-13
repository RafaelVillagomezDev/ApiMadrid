"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_controller_1 = __importDefault(require("../../controllers/image-controller"));
const express_1 = __importDefault(require("express"));
const image_schema_1 = require("../../schemas/image-schema");
const multer_1 = require("../../utils/multer");
const router = express_1.default.Router();
router.post('/create/:relatedType/:relatedId', image_schema_1.ImageSchema.create, multer_1.upload.array('images'), image_controller_1.default.createImage);
exports.default = router;
