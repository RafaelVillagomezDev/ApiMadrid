"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restaurant_controller_1 = __importDefault(require("../../controllers/restaurant-controller"));
const express_1 = __importDefault(require("express"));
const restaurant_schema_1 = require("../../schemas/restaurant-schema");
const auth_hmac_1 = require("../../auth/auth-hmac");
const auth_token_1 = require("../../middleware/auth-token");
const verify_token_blacklist_1 = require("../../middleware/verify-token-blacklist");
const router = express_1.default.Router();
router.post('/create', restaurant_schema_1.RestaurantSchema.create, restaurant_controller_1.default.createRestaurant);
router.get('', auth_token_1.authToken, verify_token_blacklist_1.checkBlacklist, restaurant_schema_1.RestaurantSchema.get, restaurant_controller_1.default.getRestaurants);
router.post('/remove/:id', auth_hmac_1.verifyHmacAuthenticity, auth_token_1.authToken, restaurant_schema_1.RestaurantSchema.remove, restaurant_controller_1.default.removeRestaurant);
exports.default = router;
