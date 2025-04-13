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
exports.LocationSchema = void 0;
const express_validator_1 = require("express-validator");
const bd_1 = require("../connection/bd");
const restaurant_query_1 = require("../queries/restaurant-query");
const promisePool = bd_1.pool.promise();
const validateRelatedType = (value) => {
    if (value !== 'restaurant') {
        throw new Error('El relatedType solo puede ser "restaurant"');
    }
    return true;
};
const LocationSchema = {
    create: (0, express_validator_1.checkSchema)({
        relatedType: {
            in: ['params'],
            exists: {
                options: {
                    checkNull: true,
                    checkFalsy: true,
                },
                errorMessage: 'El tipo relacionado es obligatorio',
            },
            isLength: {
                options: { max: 30 },
                errorMessage: 'El tipo debe tener máximo 30 caracteres',
            },
            custom: {
                options: validateRelatedType,
            },
        },
        relatedId: {
            in: ['params'],
            isUUID: {
                errorMessage: 'Id debe ser un UUID válido',
            },
            custom: {
                options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                    const [rows] = yield promisePool.query((0, restaurant_query_1.isRestaurant)(), [
                        value,
                    ]);
                    if (rows.length === 0) {
                        throw new Error('No existe un restaurante con ese ID en la base de datos');
                    }
                    return true;
                }),
            },
        },
        address: {
            in: ['body'],
            trim: true,
            escape: true,
            exists: {
                options: {
                    checkNull: true,
                    checkFalsy: true,
                },
                errorMessage: 'La dirección es obligatoria',
            },
            isLength: {
                options: { max: 500 },
                errorMessage: 'La dirección debe tener máximo 500 caracteres',
            },
        },
    }),
};
exports.LocationSchema = LocationSchema;
