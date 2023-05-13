"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
// import { isAuthenticated } from "../middlewares/auth";
const router = express_1.default.Router();
router.post("/signup", user_controller_1.signup);
router.post("/login", user_controller_1.login);
exports.default = router;
