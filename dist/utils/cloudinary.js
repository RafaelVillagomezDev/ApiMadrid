"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagesToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEYCLOUDINARY,
    api_secret: process.env.APISECRETCLOUDINARY,
};
cloudinary_1.v2.config(cloudinaryConfig);
const uploadImagesToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (err, res) => {
            if (err) {
                reject(new Error('Error uploading image to Cloudinary: ' + err.message));
            }
            else {
                resolve((res === null || res === void 0 ? void 0 : res.secure_url) || '');
            }
        });
    });
});
exports.uploadImagesToCloudinary = uploadImagesToCloudinary;
