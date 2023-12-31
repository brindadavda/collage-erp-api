/* eslint-disable */
import { Router } from "express";
import auth from "../../utils/auth";
import StudentController from "./student.controllers";

export const studentRouter: Router = Router();

import { StudentDataGenerate } from "./student.datagenrate";

//adding the dummy data
studentRouter.post("/add_dummy_data", StudentDataGenerate);

//create a student data
studentRouter.post("/create", auth, StudentController.createStudent);

//read a student data
studentRouter.get("/read", auth, StudentController.readStudents);

//update a student data
studentRouter.patch("/update/:id", auth, StudentController.updateStudents);

//delete a student data
studentRouter.delete("/delete/:id", auth, StudentController.deleteStudent);
