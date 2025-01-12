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
const RestaurantController = {
    createRestaurant: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const errorResponse = {
                message: 'Validation failed',
                data: errors.array(),
                code: 400,
            };
            if (!errors.isEmpty()) {
                res.status(400).json(errorResponse);
            }
            const validData = (0, express_validator_1.matchedData)(req);
            const restaurant = {
                id: validData.id,
                email: validData.email,
                name: validData.name,
                address: validData.address
            };
            yield restaurant_factory_1.RestaurantFactory.createRestaurant(restaurant);
            const response = {
                message: 'Restaurante creado con éxito',
                code: 200,
            };
            res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = RestaurantController;
