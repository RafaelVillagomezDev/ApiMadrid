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
const image_factory_1 = require("../factory/image-factory");
const ImageController = {
    createImage: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res
                    .status(400)
                    .json({
                    message: 'Error de validación',
                    data: errors.array(),
                    code: 400,
                });
                return;
            }
            const { relatedId, relatedType } = (0, express_validator_1.matchedData)(req);
            const cloudinaryResults = req.cloudinaryResults;
            if (!cloudinaryResults || cloudinaryResults.length === 0) {
                res
                    .status(400)
                    .json({ message: 'No hay imágenes procesadas.', code: 400 });
                return;
            }
            const createdImages = [];
            for (const result of cloudinaryResults) {
                // 🚀 OPTIMIZACIÓN CRÍTICA: Transformación al vuelo
                // Insertamos f_auto (formato automático como WebP) y q_auto (calidad automática)
                // Reemplazamos "/upload/" por "/upload/f_auto,q_auto/"
                const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
                const image = {
                    id: (0, uuid_1.v4)(),
                    relatedId,
                    relatedType,
                    url: optimizedUrl, // Guardamos la URL ya optimizada
                };
                const newImageRecord = yield image_factory_1.ImageFactory.createImage(image);
                createdImages.push(newImageRecord);
            }
            res.status(200).json({
                message: 'Imágenes creadas y optimizadas con éxito.',
                code: 200,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = ImageController;
