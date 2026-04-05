"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const anonymous_controller_1 = __importDefault(require("../../controllers/anonymous-controller"));
const blacklist_controller_1 = require("../../controllers/blacklist-controller");
const auth_token_1 = require("../../middleware/auth-token");
const router = express_1.default.Router();
router.post('/token', anonymous_controller_1.default.loginAnonymous);
router.post('/logout', auth_token_1.authToken, blacklist_controller_1.revokeSession);
exports.default = router;
