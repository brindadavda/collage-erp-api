"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.StudentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.StudentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    phone_number: Number,
    department: {
        type: String,
        required: true,
    },
    batch: {
        type: Number,
        required: true,
    },
    current_sem: {
        type: Number,
        required: true,
    },
});
exports.StudentModel = (0, mongoose_1.model)("Student", exports.StudentSchema, "students");
//# sourceMappingURL=student.model.js.map