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
exports.Image = void 0;
const bd_1 = require("../../connection/bd");
const image_query_1 = require("../../queries/image-query");
// Obtener el pool de promesas
const promisePool = bd_1.pool.promise();
class Image {
    constructor({ id, relatedId, relatedType, url }) {
        this.id = id;
        this.relatedId = relatedId;
        this.relatedType = relatedType;
        this.url = url;
    }
    createImage() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield promisePool.getConnection();
            yield connection.beginTransaction();
            try {
                const queryCreate = (0, image_query_1.createImage)();
                const [result] = yield connection.query(queryCreate, [
                    this.id,
                    this.relatedId,
                    this.relatedType,
                    this.url,
                ]);
                if (result.affectedRows === 0) {
                    throw new Error('No se pudo crear la imagen');
                }
                yield connection.commit();
                connection.release();
                return result.affectedRows;
            }
            catch (error) {
                yield connection.rollback();
                connection.release();
                throw error;
            }
        });
    }
    existImage() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryExist = (0, image_query_1.existImage)();
            // Ejecutar la consulta usando el pool de promesas
            const [rows] = yield promisePool.query(queryExist, [this.id]);
            if (rows.length > 0) {
                throw new Error('Ya existe esa imagen en nuestra bbdd');
            }
            return rows.length;
        });
    }
}
exports.Image = Image;
