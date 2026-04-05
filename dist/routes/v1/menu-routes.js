"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const menu_controller_1 = __importDefault(require("../../controllers/menu-controller"));
const menu_schema_1 = require("../../schemas/menu-schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/create', menu_schema_1.MenuSchema.create, menu_controller_1.default.createMenu);
exports.default = router;
