"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.StudentSchema = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
exports.StudentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone_number: {
        type: Number,
        validate(value) {
            if (!validator_1.default.isMobilePhone(value.toString())) {
                throw new Error("Phone number is invalid");
            }
        },
    },
    department: {
        type: String,
        required: true,
    },
    batch: {
        type: Number,
        required: true,
    },
    current_sem: {
        type: Number,
        required: true,
    },
});
exports.StudentModel = (0, mongoose_1.model)("Student", exports.StudentSchema, "students");
