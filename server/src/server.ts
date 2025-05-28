// src/server.ts
import app from "./app";
import connectDB from "./config/db";
import { PORT, NODE_ENV } from "./config/environment";
import { logger } from "./utils/logger"; // <--- IMPORT THE LOGGER

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  // Replace console.log with logger.info
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
