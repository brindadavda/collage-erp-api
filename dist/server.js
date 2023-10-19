"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongooseConn");
const user_1 = require("./user/router/user");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
app.use(express_1.default.json());
//set all the routers
app.use('/user', user_1.userRouter);
//testing purpose only
app.get('', (req, res) => {
    res.send('server is running');
});
app.listen(port, '0.0.0.0', () => {
    console.log(`server is running on localhost:${port}`);
});
//# sourceMappingURL=server.js.map