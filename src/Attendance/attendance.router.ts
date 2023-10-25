
/* eslint-disable */
import { Router, Request, Response } from "express";

/* eslint-disable */
import { createAttendanceData , query1 , getAbsentStudents } from "./attendance.controller";

export const analyticsRouter: Router = Router();

analyticsRouter.post('/',createAttendanceData);

analyticsRouter.get('/qury1',query1);
analyticsRouter.get('/qury2',getAbsentStudents);

