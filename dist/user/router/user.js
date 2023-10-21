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
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = __importDefault(require("../controllers/user"));
exports.userRouter = (0, express_1.Router)();
//testing purpose
exports.userRouter.get("", (req, res) => {
    res.send("User router is working");
});
//create user
exports.userRouter.post("/create", user_1.default.createUser);
//login user
exports.userRouter.post("/login", user_1.default.loginUser);
//logout user
exports.userRouter.post("/logout", auth_1.default, user_1.default.logout);
//logout all token
exports.userRouter.post("/logoutall", auth_1.default, user_1.default.logoutall);
//getting user data
exports.userRouter.get("/me", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(req.user);
}));
//# sourceMappingURL=user.js.map