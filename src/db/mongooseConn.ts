// mongoose.ts
import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://0.0.0.0:27017/college-erp";

// Configure Mongoose to use ES6 Promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(MONGO_URL);

// Get the default connection
const db = mongoose.connection;

// Handle connection errors
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Connection successful
db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default db;
