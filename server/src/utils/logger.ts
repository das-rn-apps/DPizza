// src/utils/logger.ts
import { NODE_ENV } from "../config/environment";

const log = (level: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  if (NODE_ENV === "development") {
    // In dev, log to console
    if (level === "error") {
      console.error(
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        data || ""
      );
    } else if (level === "warn") {
      console.warn(
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        data || ""
      );
    } else {
      console.log(
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        data || ""
      );
    }
  } else {
    // In production, send to a file or external service
    // For now, still console.log, but in a real app, this would be different
    console.log(JSON.stringify({ timestamp, level, message, data }));
  }
};

export const logger = {
  info: (message: string, data?: any) => log("info", message, data),
  warn: (message: string, data?: any) => log("warn", message, data),
  error: (message: string, data?: any) => log("error", message, data),
  debug: (message: string, data?: any) => {
    if (NODE_ENV === "development") {
      // Only log debug in dev
      log("debug", message, data);
    }
  },
};
