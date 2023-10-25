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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = void 0;
/* eslint-disable */
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password can not contain password');
            }
        }
    },
    role: {
        type: String,
        require: true,
        uppercase: true,
    },
    tokens: [
        {
            token: {
                type: String,
            },
        },
    ],
}, {
    timestamps: true,
});
//adding password hasing
exports.UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});
//finding user by email , role , password
exports.UserSchema.statics.findUser = async function (email, role, password) {
    const user = await exports.UserModel.findOne({ email, role });
    if (!user) {
        return "User Not found";
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return "Password dos not workable";
    }
    return user;
};
// Generate a JWT token for the user
exports.UserSchema.methods.generateAuthToken = async function () {
    const user = this; // Cast to User type
    const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || "secret"); // Replace 'your-secret-key' with your actual secret key
    user.tokens = user.tokens || [];
    return token;
};
//we don't share the password and token
exports.UserSchema.methods.toJSON = function () {
    const UserObject = this.toObject();
    delete UserObject.password;
    delete UserObject.tokens;
    return UserObject;
};
exports.UserModel = (0, mongoose_1.model)("User", exports.UserSchema, "user");
