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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../model/user.model");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    //auth header null
    if (!authHeader) {
        return res.status(401).json("No authorization header found");
    }
    //getting token from header
    const token = authHeader.split(" ")[1];
    //verify the token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        const user = yield user_model_1.UserModel.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        req.role = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json("Invalid token");
    }
});
exports.default = auth;
//# sourceMappingURL=user.middleware.js.map