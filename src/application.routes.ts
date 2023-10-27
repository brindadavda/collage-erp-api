import { Application } from 'express';
import IndexRoute from 'index';
import { userRouter } from './components/user/user.router';
import { studentRouter } from 'components/student/student.router';
import { attendanceRouter } from 'components/Attendance/attendance.router';

export default class ApplicationConfig {
    public static registerRoute(app: Application) {
        app.use('/', IndexRoute);
        app.use("/user", userRouter);
        app.use("/student", studentRouter);
        app.use("/attendance", attendanceRouter);
    }
}