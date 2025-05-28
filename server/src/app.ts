// src/app.ts
import express from "express";
import cors from "cors";
import { json } from "express";
import { CORS_ORIGIN } from "./config/environment";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import apiRoutes from "./routes"; // Import your central API routes

const app = express();

// CORS setup
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parser middleware
app.use(json());

// API routes
app.use("/", apiRoutes);

// Custom error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
