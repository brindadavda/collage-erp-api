"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const student_middleware_1 = require("./student.middleware");
const student_model_1 = require("./student.model");
class StudentController {
    //creating user
    static async createStudent(req, res) {
        const valid = (0, student_middleware_1.checkRole)(req.user.role);
        //valid user
        if (valid) {
            if (Object.keys(req.body).length != 0) {
                try {
                    const student = new student_model_1.StudentModel(req.body);
                    await student.save();
                    return res.status(201).send("Student Data created successfully");
                }
                catch (e) {
                    return res.send({ error: e.message });
                }
            }
            return res.send("Please provide the data");
        }
        return res.send(`Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`);
    }
    // Read the student data
    static async readStudents(req, res) {
        const studentData = await student_model_1.StudentModel.find({});
        return res.send(studentData);
    }
    //update the student data
    static async updateStudents(req, res) {
        const valid = (0, student_middleware_1.checkRole)(req.user.role);
        if (valid) {
            //check for the property is correct or not
            try {
                const allowedUpdates = [
                    "name",
                    "phone_number",
                    "department",
                    "batch",
                    "current_sem",
                ]; // defineing update property
                const updates = Object.keys(req.body);
                //checking for valid value or not
                const isvalidOperation = updates.map((update) => allowedUpdates.includes(update));
                let operationValid = false;
                isvalidOperation.forEach((value) => {
                    if (value) {
                        return (operationValid = true);
                    }
                });
                if (!operationValid) {
                    return res.status(400).json({ error: "Invalid updates!" });
                }
                await student_model_1.StudentModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
                return res.send("Data update successfully!");
            }
            catch (e) {
                return res.status(404).json({ error: e });
            }
        }
        return res.send(`Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`);
    }
    //delete the student data
    static async deleteStudent(req, res) {
        const valid = (0, student_middleware_1.checkRole)(req.user.role);
        if (valid) {
            await student_model_1.StudentModel.findByIdAndDelete({ _id: req.params.id });
            return res.send("Data Deleted Sccuessfully");
        }
        return res.send(`Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`);
    }
}
exports.default = StudentController;
