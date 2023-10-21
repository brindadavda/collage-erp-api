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
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    //creating user
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                //if data not getting from req.body
                if (Object.keys(userData).length == 0) {
                    return res.send("Please provide user details");
                }
                const findUser = yield user_model_1.UserModel.findOne({
                    email: req.body.email,
                    role: req.body.role,
                });
                if (findUser) {
                    return res.status(400).send("User already created");
                }
                // Create a new instance of UserModel
                const user = new user_model_1.UserModel(userData);
                // Save the user to the database
                yield user.save();
                res.status(201).send(user);
            }
            catch (error) {
                res.status(500).send("Internal server error");
            }
        });
    }
    //login user
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user by email & role & passsword
                console.log(req.body.password);
                const foundUser = yield user_model_1.UserModel.findUser(req.body.email, req.body.role, req.body.passsword);
                console.log('line 46' + foundUser);
                if (!foundUser) {
                    return res.send("Email not found Or Role not found");
                }
                //if password no provided
                if (!req.body.password) {
                    return res.send("Password not found");
                }
                console.log(req.body.password);
                const isMatch = yield bcryptjs_1.default.compare(req.body.password, foundUser.password);
                if (isMatch) {
                    // Generate a JWT token for the user
                    const token = yield foundUser.generateAuthToken();
                    foundUser.tokens = foundUser.tokens.concat({ token });
                    // await foundUser.save();
                    res.status(200).send({ user: foundUser, token });
                }
                else {
                    return res.status(400).send("Invalid password");
                }
            }
            catch (error) {
                return res.status(500).send("Internal server error");
            }
        });
    }
    //logout user
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
                console.log(req.user);
                yield req.user.save();
                res.send("Successfully Logout");
            }
            catch (e) {
                res.status(500).send(e.toString());
            }
        });
    }
    //logout all token
    static logoutall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.user.tokens = [];
                yield req.user.save();
                res.status(200).send("Logout All");
            }
            catch (e) {
                res.status(500).send(e.toString());
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controllers.js.map