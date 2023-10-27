"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../components/user/user.model");
const auth = 
/**
 * Description placeholder
 * @date 10/23/2023 - 12:33:54 PM
 *
 * @async
 * @param {JwtRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {unknown}
 */
async (req, res, next) => {
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
        const user = await user_model_1.UserModel.findOne({
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
};
exports.default = auth;
