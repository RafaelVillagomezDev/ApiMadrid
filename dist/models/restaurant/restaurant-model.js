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
// Obtener el pool de promesas
const promisePool = bd_1.pool.promise();
class Restaurant {
    constructor({ id, email, name, address }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.address = address;
    }
    createRestaurant() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCreate = (0, restaurant_query_1.createRestaurant)();
            try {
                const [result] = yield promisePool.query(queryCreate, [
                    this.id,
                    this.email,
                    this.name,
                    this.address,
                ]);
                return result.affectedRows;
            }
            catch (error) {
                console.error('Error creating restaurant:', error);
                throw new Error('Error while creating the restaurant');
            }
        });
    }
}
exports.Restaurant = Restaurant;
