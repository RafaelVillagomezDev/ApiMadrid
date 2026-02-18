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
exports.RestaurantFactory = void 0;
const restaurant_model_1 = require("../models/restaurant/restaurant-model");
class RestaurantFactory {
    static createRestaurant(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = new restaurant_model_1.Restaurant(obj);
            yield restaurant.existRestaurant();
            const rows = yield restaurant.createRestaurant();
            return rows;
        });
    }
    static getRestaurant(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = new restaurant_model_1.Restaurant(obj);
            const rows = yield restaurant.getRestaurants(restaurant);
            return rows;
        });
    }
    static removeRestaurant(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = new restaurant_model_1.Restaurant(obj);
            yield restaurant.existRestaurant();
            const rows = yield restaurant.removeRestaurants();
            return rows;
        });
    }
}
exports.RestaurantFactory = RestaurantFactory;
