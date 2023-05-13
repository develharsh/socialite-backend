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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = 201;
    try {
        if (!process.env.JWT_SECRET) {
            statusCode = 500;
            throw new Error("Env Secret not loaded");
        }
        let { email, password, username } = req.body;
        if (!email) {
            statusCode = 400;
            throw new Error("Invalid Email");
        }
        if (!password) {
            statusCode = 400;
            throw new Error("Invalid Password");
        }
        if (!username) {
            statusCode = 400;
            throw new Error("Invalid Username");
        }
        const exists = yield user_model_1.default.findOne({
            $or: [{ email }, { username }],
        }).lean();
        if (exists) {
            statusCode = 500;
            throw new Error(exists.email === email
                ? "Email already registered"
                : "Username already registered");
        }
        password = yield bcrypt_1.default.hash(password, 12);
        const user = yield user_model_1.default.create({ email, password, username });
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });
        res
            .status(statusCode)
            .json({ success: true, message: `Successfully registered user`, token });
    }
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = 200;
    try {
        if (!process.env.JWT_SECRET) {
            statusCode = 500;
            throw new Error("Env Secret not loaded");
        }
        let { email, password, username } = req.body;
        if (!email && !username) {
            statusCode = 400;
            throw new Error("Invalid email or username");
        }
        if (!password) {
            statusCode = 400;
            throw new Error("Invalid Password");
        }
        const exists = yield user_model_1.default.findOne({
            $or: [{ email }, { username }],
        }).lean();
        if (!exists) {
            statusCode = 500;
            throw new Error(`No such user exists`);
        }
        const isPasswordMatching = yield bcrypt_1.default.compare(password, exists.password);
        if (!isPasswordMatching) {
            statusCode = 400;
            throw new Error("No such user with pas exists");
        }
        const token = jsonwebtoken_1.default.sign({ _id: exists._id }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });
        res
            .status(statusCode)
            .json({
            success: true,
            message: `Successfully logged in with user`,
            token,
        });
    }
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message });
    }
});
exports.login = login;
