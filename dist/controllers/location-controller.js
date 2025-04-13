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
const location_factory_1 = require("../factory/location-factory");
const uuid_1 = require("uuid");
const geodata_1 = require("../utils/geodata");
const LocationController = {
    createLocation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const errorResponse = {
                message: 'Error en validación',
                data: errors.array(),
                code: 400,
            };
            if (!errors.isEmpty()) {
                res.status(400).json(errorResponse);
                return;
            }
            const validData = (0, express_validator_1.matchedData)(req);
            const geoData = yield (0, geodata_1.getCoords)(validData.address);
            const location = {
                relatedId: validData.relatedId,
                id: yield (0, uuid_1.v4)(),
                relatedType: validData.relatedType,
                address: validData.address,
                latitude: geoData.latitud,
                longitude: geoData.longitud,
                country: geoData.country,
                town: geoData.town,
                county: geoData.county,
            };
            yield location_factory_1.LocationFactory.createLocation(location);
            const response = {
                message: 'Localización creada con éxito',
                code: 200,
            };
            res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = LocationController;
