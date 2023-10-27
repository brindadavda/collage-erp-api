"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRouter = void 0;
/* eslint-disable */
const express_1 = require("express");
const auth_1 = __importDefault(require("../../utils/auth"));
const student_controllers_1 = __importDefault(require("./student.controllers"));
exports.studentRouter = (0, express_1.Router)();
const student_datagenrate_1 = require("./student.datagenrate");
//adding the dummy data
exports.studentRouter.post("/add_dummy_data", student_datagenrate_1.StudentDataGenerate);
//create a student data
exports.studentRouter.post("/create", auth_1.default, student_controllers_1.default.createStudent);
//read a student data
exports.studentRouter.get("/read", auth_1.default, student_controllers_1.default.readStudents);
//update a student data
exports.studentRouter.patch("/update/:id", auth_1.default, student_controllers_1.default.updateStudents);
//delete a student data
exports.studentRouter.delete("/delete/:id", auth_1.default, student_controllers_1.default.deleteStudent);
