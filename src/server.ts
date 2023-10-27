/* eslint-disable */
import express from "express";

/* eslint-disable */
import "./db/mongooseConn";
import { logger } from "./utils/winston-logger";

/* eslint-disable */
import { userRouter } from "./components/user/user.router";

/* eslint-disable */
import { studentRouter } from "./components/student/student.router";

/* eslint-disable */
import { attendanceRouter } from "./components/Attendance/attendance.router";

const app: express.Application = express();

const PORT = 300;

app.use(express.json());
//set all the routers
app.use("/user", userRouter);
app.use("/student", studentRouter);
app.use("/attendance", attendanceRouter);

app.listen(3000, () => {
  logger.info(`server running on localhost:${PORT}`);
});
