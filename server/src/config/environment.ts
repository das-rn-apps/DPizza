// src/config/environment.ts
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/pizzashop";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const NODE_ENV = process.env.NODE_ENV || "development";

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined!");
  process.exit(1);
}
