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
exports.Menu = void 0;
const menu_query_1 = require("../../queries/menu-query");
const bd_1 = require("../../connection/bd");
const uuid_1 = require("uuid");
class Menu {
    constructor({ id, restaurant_id, name, description, dishes }) {
        this.id = id;
        this.restaurant_id = restaurant_id;
        this.name = name;
        this.description = description;
        this.dishes = dishes || [];
    }
    createMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield bd_1.pool.promise().getConnection();
            try {
                yield conn.beginTransaction();
                const queryCreateMenu = (0, menu_query_1.createMenu)();
                const [menuResult] = yield conn.query(queryCreateMenu, [
                    this.id,
                    this.restaurant_id,
                    this.name,
                    this.description || null,
                ]);
                if (menuResult.affectedRows === 0) {
                    throw new Error('No se pudo crear el menú');
                }
                const queryCreateDish = (0, menu_query_1.createDishes)();
                for (const dish of this.dishes) {
                    const dishId = (0, uuid_1.v4)();
                    yield conn.query(queryCreateDish, [
                        dishId,
                        this.id,
                        dish.name,
                        dish.description || null,
                        dish.price,
                        dish.category,
                    ]);
                }
                yield conn.commit();
                return menuResult.affectedRows;
            }
            catch (err) {
                yield conn.rollback();
                throw new Error('Error al crear el menú:');
            }
            finally {
                conn.release();
            }
        });
    }
}
exports.Menu = Menu;
