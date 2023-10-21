"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongooseConn");
const user_router_1 = require("./user/user.router");
const student_router_1 = require("./student/student.router");
const analytics_router_1 = require("./Analytics/analytics.router");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
app.use(express_1.default.json());
//set all the routers
app.use("/user", user_router_1.userRouter);
app.use("/student", student_router_1.studentRouter);
app.use("/analytics", analytics_router_1.analyticsRouter);
app.listen(port, "0.0.0.0", () => {
    console.log(`server is running on localhost:${port}`);
});
//# sourceMappingURL=server.js.map