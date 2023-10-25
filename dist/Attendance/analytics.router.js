"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
/* eslint-disable */
const express_1 = require("express");
/* eslint-disable */
const attendance_controller_1 = require("./attendance.controller");
exports.analyticsRouter = (0, express_1.Router)();
exports.analyticsRouter.post('/', attendance_controller_1.createAttendanceData);
