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
exports.LocationFactory = void 0;
const location_model_1 = require("../models/location/location-model");
class LocationFactory {
    static createLocation(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = new location_model_1.Location(obj);
            yield location.existLocation();
            const rows = yield location.createLocation();
            return rows;
        });
    }
    static getLocation(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = new location_model_1.Location(obj);
            const rows = yield location.getLocation();
            return rows;
        });
    }
}
exports.LocationFactory = LocationFactory;
