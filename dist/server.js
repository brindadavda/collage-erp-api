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
const user_router_1 = require("./user/user.router");
/* eslint-disable */
const student_router_1 = require("./student/student.router");
/* eslint-disable */
const attendance_router_1 = require("./Attendance/attendance.router");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
app.use(express_1.default.json());
//set all the routers
app.use("/user", user_router_1.userRouter);
app.use("/student", student_router_1.studentRouter);
app.use("/attendance", attendance_router_1.analyticsRouter);
app.listen(port, "0.0.0.0", () => {
    log_1.logger.info(`server running on localhost:${port}`);
    console.log(`server is running on localhost:${port}`);
});
