
/* eslint-disable */
import express from "express";

/* eslint-disable */
import "./db/mongooseConn";
import { logger } from "./utils/log"

/* eslint-disable */
import { userRouter } from "./user/user.router";

/* eslint-disable */
import { studentRouter } from "./student/student.router";

/* eslint-disable */
import { analyticsRouter } from "./Attendance/attendance.router";


const app: express.Application = express();

const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());
//set all the routers
app.use("/user", userRouter);
app.use("/student", studentRouter);
app.use("/attendance", analyticsRouter);

app.listen(port, "0.0.0.0", () => {
  logger.info(`server running on localhost:${port}`);
  console.log(`server is running on localhost:${port}`);
});
