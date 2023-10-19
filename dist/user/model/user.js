"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.UserSchema = new mongoose_1.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        uppercase: true
    },
    tokens: [{
            token: {
                type: String
            }
        }],
}, {
    timestamps: true
});
//adding password hasing
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            user.password = yield bcrypt.hash(user.password, 8);
        }
        next();
    });
});
// Generate a JWT token for the user
exports.UserSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; // Cast to User type
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret'); // Replace 'your-secret-key' with your actual secret key
        user.tokens = user.tokens || [];
        return token;
    });
};
//we don't share the password and token
exports.UserSchema.methods.toJSON = function () {
    const user = this;
    const UserObject = user.toObject();
    delete UserObject.password;
    delete UserObject.tokens;
    return UserObject;
};
exports.UserModel = (0, mongoose_1.model)('User', exports.UserSchema, 'user');
//# sourceMappingURL=user.js.map