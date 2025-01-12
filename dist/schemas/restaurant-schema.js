"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantSchema = void 0;
const express_validator_1 = require("express-validator");
const RestaurantSchema = {
    create: (0, express_validator_1.checkSchema)({
        email: {
            in: ['body'],
            errorMessage: 'Email inválido',
            isLength: {
                options: { max: 50 },
                errorMessage: 'El email debe tener máximo 50 caracteres',
            },
            trim: true,
            escape: true,
            matches: {
                options: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                errorMessage: 'Formato de email inválido',
            },
        },
    }),
};
exports.RestaurantSchema = RestaurantSchema;
