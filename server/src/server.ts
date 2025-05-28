// src/server.ts
import app from "./app";
import connectDB from "./config/db";
import { PORT, NODE_ENV } from "./config/environment";

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
