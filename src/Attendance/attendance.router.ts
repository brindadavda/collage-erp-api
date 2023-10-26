
/* eslint-disable */
import { Router, Request, Response } from "express";

/* eslint-disable */
import { createAttendanceData , query1 , getAbsentStudents , getAttendanceLessthen75 , getVacantSeatsYearWise} from "./attendance.controller";

export const analyticsRouter: Router = Router();

analyticsRouter.post('/',createAttendanceData);

analyticsRouter.get('/qury1',query1);
analyticsRouter.get('/qury2',getAbsentStudents);
analyticsRouter.get('/qury3',getAttendanceLessthen75);
analyticsRouter.get('/qury4',getVacantSeatsYearWise);

