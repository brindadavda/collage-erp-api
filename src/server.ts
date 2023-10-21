import express from "express";
import "./db/mongooseConn";
import { userRouter } from "./user/user.router";
import { studentRouter } from "./student/student.router";
import { analyticsRouter } from "./Analytics/analytics.router";

const app: express.Application = express();

const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());
//set all the routers
app.use("/user", userRouter);
app.use("/student", studentRouter);
app.use("/analytics", analyticsRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`server is running on localhost:${port}`);
});
