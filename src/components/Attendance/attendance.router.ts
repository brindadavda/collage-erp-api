/* eslint-disable */
import { Router } from "express";
import { createAttendanceData } from "./attendance.dummyData";
/* eslint-disable */
import {
  query1,
  getAbsentStudents,
  getAttendanceLessthen75,
  getVacantSeatsYearWise,
} from "./attendance.controller";

export const attendanceRouter: Router = Router();

attendanceRouter.post("/", createAttendanceData);

attendanceRouter.get("/qury1", query1);
attendanceRouter.get("/qury2", getAbsentStudents);
attendanceRouter.get("/qury3", getAttendanceLessthen75);
attendanceRouter.get("/qury4", getVacantSeatsYearWise);
