"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_schema_1 = require("../../schemas/location-schema");
const location_controller_1 = __importDefault(require("../../controllers/location-controller"));
const router = express_1.default.Router();
router.post('/create/:relatedType/:relatedId', location_schema_1.LocationSchema.create, location_controller_1.default.createLocation);
exports.default = router;
