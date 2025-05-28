// src/config/db.ts
import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./environment";
import { logger } from "../utils/logger"; // <--- IMPORT THE LOGGER

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    // Use logger.info for successful connection
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    // Use logger.error for connection failures
    logger.error(`MongoDB Connection Error: ${error.message}`, {
      errorStack: error.stack,
    });
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
