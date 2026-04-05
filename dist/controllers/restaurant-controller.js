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
const restaurant_factory_1 = require("../factory/restaurant-factory");
const uuid_1 = require("uuid");
const geodata_1 = require("../utils/geodata");
const location_factory_1 = require("../factory/location-factory");
const RestaurantController = {
    createRestaurant: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res
                    .status(400)
                    .json({
                    message: 'Error en validación',
                    data: errors.array(),
                    code: 400,
                });
                return;
            }
            const validData = (0, express_validator_1.matchedData)(req);
            const restaurantId = (0, uuid_1.v4)();
            const restaurant = {
                id: restaurantId,
                email: validData.email,
                name: validData.name,
                address: validData.address,
                description: validData.description,
                phone: validData.phone,
                type_food: validData.type_food,
                web: validData.web,
            };
            const geoData = yield (0, geodata_1.getCoords)(validData.address);
            const location = {
                id: (0, uuid_1.v4)(),
                relatedId: restaurantId, // Usamos el ID generado
                relatedType: 'restaurant',
                address: validData.address,
                latitude: geoData.latitud,
                longitude: geoData.longitud,
                country: geoData.country,
                town: geoData.town,
                county: geoData.county,
            };
            // EJECUCIÓN MASIVA EN PARALELO
            yield Promise.all([
                restaurant_factory_1.RestaurantFactory.createRestaurant(restaurant),
                location_factory_1.LocationFactory.createLocation(location),
            ]);
            res.status(200).send({
                message: 'Restaurante creado con éxito',
                data: {
                    "id": restaurantId,
                    "relatedType": "restaurant"
                },
                code: 200,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getRestaurants: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const queryData = {
                name: validData.name,
                id: validData.id,
                address: validData.address,
                type_food: validData.type_food,
                limit: validData.limit,
                offset: validData.offset,
            };
            const data = yield restaurant_factory_1.RestaurantFactory.getRestaurant(queryData);
            const response = {
                message: 'Restaurante obtenidos con éxito',
                data: data.data,
                code: 200,
                count: data.total,
            };
            res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }),
    removeRestaurant: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const restaurant = {
                id: validData.id,
            };
            yield restaurant_factory_1.RestaurantFactory.removeRestaurant(restaurant);
            const response = {
                message: 'Restaurante eliiminado con éxito',
                code: 200,
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = RestaurantController;
