"use strict";
// mongoose.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/college-erp";
// Configure Mongoose to use ES6 Promises
mongoose_1.default.Promise = global.Promise;
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URL);
// Get the default connection
const db = mongoose_1.default.connection;
// Handle connection errors
db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});
// Connection successful
db.once("open", () => {
    console.log("Connected to MongoDB");
});
exports.default = db;
