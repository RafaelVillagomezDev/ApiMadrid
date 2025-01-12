"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restaurant_controller_1 = __importDefault(require("../../controllers/restaurant-controller"));
const express_1 = __importDefault(require("express"));
const restaurant_schema_1 = require("../../schemas/restaurant-schema");
const router = express_1.default.Router();
router.post('/create', restaurant_schema_1.RestaurantSchema.create, restaurant_controller_1.default.createRestaurant);
exports.default = router;
