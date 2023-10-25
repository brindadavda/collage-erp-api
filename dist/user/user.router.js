"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
/* eslint-disable */
const express_1 = require("express");
const auth_1 = __importDefault(require("../utils/auth"));
const user_controllers_1 = __importDefault(require("./user.controllers"));
exports.userRouter = (0, express_1.Router)();
//testing purpose
exports.userRouter.get("", (req, res) => {
    res.send("User router is working");
});
//create user
exports.userRouter.post("/create", user_controllers_1.default.createUser);
//login user
exports.userRouter.post("/login", user_controllers_1.default.loginUser);
//logout user
exports.userRouter.post("/logout", auth_1.default, user_controllers_1.default.logout);
//logout all token
exports.userRouter.post("/logoutall", auth_1.default, user_controllers_1.default.logoutall);
//getting user data
exports.userRouter.get("/me", auth_1.default, async (req, res) => {
    res.send(req.user);
});
