"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const express_1 = __importDefault(require("express"));
/* eslint-disable */
require("./db/mongooseConn");
const log_1 = require("./utils/log");
/* eslint-disable */
const user_router_1 = require("./components/user/user.router");
/* eslint-disable */
const student_router_1 = require("./components/student/student.router");
/* eslint-disable */
const attendance_router_1 = require("./components/Attendance/attendance.router");
const app = (0, express_1.default)();
const PORT = 4000;
app.listen(PORT, () => {
    log_1.logger.info("Server is running on port", PORT);
});
app.use(express_1.default.json());
//set all the routers
app.use("/user", user_router_1.userRouter);
app.use("/student", student_router_1.studentRouter);
app.use("/attendance", attendance_router_1.attendanceRouter);
app.listen(3000, () => {
    log_1.logger.info(`server running on localhost:${PORT}`);
    console.log(`server is running on localhost:${PORT}`);
});
