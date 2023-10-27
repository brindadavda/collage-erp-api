"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceRouter = void 0;
/* eslint-disable */
const express_1 = require("express");
const attendance_dummyData_1 = require("./attendance.dummyData");
/* eslint-disable */
const attendance_controller_1 = require("./attendance.controller");
exports.attendanceRouter = (0, express_1.Router)();
exports.attendanceRouter.post("/", attendance_dummyData_1.createAttendanceData);
exports.attendanceRouter.get("/qury1", attendance_controller_1.query1);
exports.attendanceRouter.get("/qury2", attendance_controller_1.getAbsentStudents);
exports.attendanceRouter.get("/qury3", attendance_controller_1.getAttendanceLessthen75);
exports.attendanceRouter.get("/qury4", attendance_controller_1.getVacantSeatsYearWise);
