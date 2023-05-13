"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect = () => {
    var _a;
    const connString = `${process.env[`DB_${(_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.toUpperCase()}`]}/${process.env.NODE_ENV}`;
    mongoose_1.default
        .connect(connString)
        .then(() => {
        console.log(`Connected to MongoDB.`);
        console.log(connString, `in ${process.env.NODE_ENV} Mode`);
    })
        .catch((error) => {
        console.log(`Error while connecting to DB: ${error.message}`);
    });
};
exports.connect = connect;
