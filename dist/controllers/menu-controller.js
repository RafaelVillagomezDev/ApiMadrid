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
const menu_factory_1 = require("../factory/menu-factory");
const MenuController = {
    createMenu: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorResponse = {
                    message: 'Error en validación',
                    data: errors.array(),
                    code: 400,
                };
                res.status(400).json(errorResponse);
                return;
            }
            const validData = (0, express_validator_1.matchedData)(req, { locations: ['body'] });
            const menu = {
                id: (0, uuid_1.v4)(),
                restaurant_id: validData.restaurant_id,
                name: validData.name,
                description: validData.description,
                dishes: validData.dishes,
            };
            yield menu_factory_1.MenuFactory.createMenu(menu);
            const response = {
                message: 'Menú creado con éxito',
                code: 200,
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = MenuController;
