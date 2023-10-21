"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRouter = void 0;
const express_1 = require("express");
const user_middleware_1 = __importDefault(require("../user/user.middleware"));
const student_controllers_1 = __importDefault(require("./student.controllers"));
exports.studentRouter = (0, express_1.Router)();
//create a student data
exports.studentRouter.post("/create", user_middleware_1.default, student_controllers_1.default.createStudent);
//read a student data
exports.studentRouter.get("/read", user_middleware_1.default, student_controllers_1.default.readStudents);
//update a student data
exports.studentRouter.post("/update/:id", user_middleware_1.default, student_controllers_1.default.updateStudents);
//delete a student data
exports.studentRouter.delete("/delete/:id", user_middleware_1.default, student_controllers_1.default.deleteStudent);
//# sourceMappingURL=student.router.js.map