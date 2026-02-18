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
exports.Restaurant = void 0;
const restaurant_query_1 = require("../../queries/restaurant-query");
const bd_1 = require("../../connection/bd");
const promisePool = bd_1.pool.promise();
class Restaurant {
    constructor({ id, email, name, address, description, phone, type_food, web, limit, offset, }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.address = address;
        this.description = description;
        this.phone = phone;
        this.type_food = type_food;
        this.web = web;
        this.limit = limit;
        this.offset = offset;
    }
    createRestaurant() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCreate = (0, restaurant_query_1.createRestaurant)();
            const [result] = yield promisePool.query(queryCreate, [
                this.id,
                this.email,
                this.name,
                this.address,
                this.description,
                this.phone,
                this.type_food,
                this.web,
            ]);
            if (result.affectedRows === 0) {
                throw new Error('No se pudo crear el restaurante');
            }
            return result.affectedRows;
        });
    }
    existRestaurant() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryExist = (0, restaurant_query_1.existRestaurant)();
            const [rows] = yield promisePool.query(queryExist, [
                this.email,
            ]);
            if (rows.length > 0) {
                throw new Error('Ya existe ese restaurante en nuestra bbdd');
            }
            return rows.length;
        });
    }
    getRestaurants(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, address, type_food, limit, offset } = obj;
            const [queryRestaurants, values] = (0, restaurant_query_1.getRestaurantData)({
                id,
                name,
                address,
                type_food,
                limit,
                offset,
            });
            const [queryCount, countValues] = (0, restaurant_query_1.countTotalRestaurants)({ id, name, address, type_food });
            const [[rows], [countRows]] = yield Promise.all([
                promisePool.query(queryRestaurants, values),
                promisePool.query(queryCount, countValues)
            ]);
            if (!rows || rows.length === 0) {
                throw new Error('No existen restaurantes con esas condiciones');
            }
            const data = (0, restaurant_query_1.formatRestaurantData)(rows);
            const total = countRows[0].total;
            return {
                "data": data,
                "total": total
            };
        });
    }
    removeRestaurants() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRemoveRestaurants = (0, restaurant_query_1.removeRestaurantsData)();
            const [rows] = yield promisePool.query(queryRemoveRestaurants, [this.id]);
            if (rows.length === 0) {
                throw new Error('No existen restaurantes con esas condiciones');
            }
            return rows.length;
        });
    }
}
exports.Restaurant = Restaurant;
