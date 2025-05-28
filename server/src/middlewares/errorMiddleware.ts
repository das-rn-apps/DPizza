// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/environment";
import { logger } from "../utils/logger"; // <--- IMPORT THE LOGGER

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  logger.warn(`404 Not Found: ${req.originalUrl}`, {
    ip: req.ip,
    method: req.method,
  });
  next(error);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // Even if not used, it's good practice to keep it for Express signature
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If status is 200, it's an internal server error
  res.status(statusCode);

  // Log the error using the logger
  if (statusCode === 404) {
    // 404s are usually handled by notFound middleware which already logs.
    // However, if an error somehow propagates here with a 404 status, it's good to log it.
    logger.warn(`Handled 404 Error: ${err.message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: err.stack,
    });
  } else if (statusCode >= 400 && statusCode < 500) {
    // Client errors (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden)
    logger.warn(`Client Error ${statusCode}: ${err.message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?.email,
      errorStack: err.stack,
    });
  } else {
    // Server errors (5xx)
    logger.error(`Server Error ${statusCode}: ${err.message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?.email,
      errorStack: err.stack,
    });
  }

  res.json({
    message: err.message,
    stack: NODE_ENV === "production" ? "🥞" : err.stack, // Don't expose stack in production
  });
};
