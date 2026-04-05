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
exports.Location = void 0;
const bd_1 = require("../../connection/bd");
const location_query_1 = require("../../queries/location-query");
// Obtener el pool de promesas
const promisePool = bd_1.pool.promise();
class Location {
    constructor({ relatedId, id, latitude, longitude, address, country, county, town, relatedType, }) {
        this.relatedId = relatedId;
        this.id = id !== null && id !== void 0 ? id : '';
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.country = country;
        this.county = county;
        this.town = town;
        this.relatedType = relatedType;
    }
    // Tengo que comprobar que exista en la tabla que le tengo que pasar de relatedType y el id
    existLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryExist = (0, location_query_1.existLocation)();
            // Ejecutar la consulta usando el pool de promesas
            const [rows] = yield promisePool.query(queryExist, [
                this.relatedId,
            ]);
            console.log(rows);
            if (rows.length > 0) {
                throw new Error('Ya existe esa localizacion asociada a un elemento en nuestra bbdd');
            }
            return rows.length;
        });
    }
    createLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryCreate = (0, location_query_1.createLocation)();
            // Ejecutar la consulta usando el pool de promesas
            const [result] = yield promisePool.query(queryCreate, [
                this.id,
                this.relatedId,
                this.relatedType,
                this.address,
                this.latitude,
                this.longitude,
                this.town,
                this.country,
                this.county,
            ]);
            if (result.affectedRows === 0) {
                throw new Error('No se pudo crear el restaurante ');
            }
            return result.affectedRows;
        });
    }
    getLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryGet = (0, location_query_1.getLocation)();
            const [rows] = yield promisePool.query(queryGet, [
                this.relatedId,
            ]);
            if (rows.length === 0) {
                throw new Error('No existe ese restaurante en nuestra bbdd');
            }
            return rows;
        });
    }
}
exports.Location = Location;
