"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongooseConn");
const app = (0, express_1.default)();
const port = 3000;
//testing purpose only
app.get("", (req, res) => {
  res.send("server is running");
});
app.listen(port, "0.0.0.0", () => {
  console.log(`server is running on localhost:${port}`);
});
//# sourceMappingURL=index.js.map
