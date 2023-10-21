import { Router } from "express";
import auth from "../user/user.middleware";
import StudentController from "./student.controllers";

export const studentRouter: Router = Router();

//create a student data
studentRouter.post("/create", auth, StudentController.createStudent);

//read a student data
studentRouter.get("/read", auth, StudentController.readStudents);

//update a student data
studentRouter.post("/update/:id", auth, StudentController.updateStudents);

//delete a student data
studentRouter.delete("/delete/:id", auth, StudentController.deleteStudent);
