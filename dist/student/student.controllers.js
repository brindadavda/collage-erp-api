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
Object.defineProperty(exports, "__esModule", { value: true });
const student_middleware_1 = require("./student.middleware");
const student_model_1 = require("./student.model");
class StudentController {
    //creating user
    static createStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = (0, student_middleware_1.checkRole)(req.user.role);
            //valid user
            if (valid) {
                if (Object.keys(req.body).length != 0) {
                    try {
                        const student = new student_model_1.StudentModel(req.body);
                        yield student.save();
                        return res.status(201).send("Student Data created successfully");
                    }
                    catch (e) {
                        return res.send({ error: e.message });
                    }
                }
                return res.send("Please provide the data");
            }
            return res.send(`Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`);
        });
    }
    // Read the student data
    static readStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentData = yield student_model_1.StudentModel.find({});
            return res.send(studentData);
        });
    }
    //update the student data
    static updateStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    yield student_model_1.StudentModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
                    return res.send("Data update successfully!");
                }
                catch (e) {
                    return res.status(404).json({ error: e });
                }
            }
            return res.send(`Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`);
        });
    }
    //delete the student data
    static deleteStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = (0, student_middleware_1.checkRole)(req.user.role);
            if (valid) {
                yield student_model_1.StudentModel.findByIdAndDelete({ _id: req.params.id });
                return res.send("Data Deleted Sccuessfully");
            }
            return res.send(`Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`);
        });
    }
}
exports.default = StudentController;
//# sourceMappingURL=student.controllers.js.map