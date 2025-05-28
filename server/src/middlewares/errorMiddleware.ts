// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/environment";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If status is 200, it's an internal server error
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: NODE_ENV === "production" ? "🥞" : err.stack, // Don't expose stack in production
  });
};
