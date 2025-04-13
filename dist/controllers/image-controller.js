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
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const cloudinary_1 = require("../utils/cloudinary");
const image_factory_1 = require("../factory/image-factory");
const ImageController = {
    createImage: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    message: 'Error en la validación de los datos.',
                    data: errors.array(),
                    code: 400,
                });
                return;
            }
            // Extraer los datos validados
            const validData = (0, express_validator_1.matchedData)(req);
            const { relatedId, relatedType } = validData;
            const urls = [];
            let files;
            files = req.files;
            for (const file of files) {
                const newPath = yield (0, cloudinary_1.uploadImagesToCloudinary)(file);
                urls.push(newPath);
            }
            const multiImage = urls.map((url) => url);
            const image = {
                id: yield (0, uuid_1.v4)(),
                relatedId: relatedId,
                relatedType: relatedType,
                url: multiImage,
            };
            yield image_factory_1.ImageFactory.createImage(image);
            res.status(200).json({
                message: 'Imagen creada con éxito',
                code: 200,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = ImageController;
