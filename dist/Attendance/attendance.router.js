"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
/* eslint-disable */
const express_1 = require("express");
/* eslint-disable */
const attendance_controller_1 = require("./attendance.controller");
exports.analyticsRouter = (0, express_1.Router)();
exports.analyticsRouter.post('/', attendance_controller_1.createAttendanceData);
exports.analyticsRouter.get('/qury1', attendance_controller_1.query1);
exports.analyticsRouter.get('/qury2', attendance_controller_1.getAbsentStudents);
exports.analyticsRouter.get('/qury3', attendance_controller_1.getAttendanceLessthen75);
exports.analyticsRouter.get('/qury4', attendance_controller_1.getVacantSeatsYearWise);
