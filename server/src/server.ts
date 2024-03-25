import dotenv from "dotenv";
dotenv.config();
import "./utils/env-validation";

import app from "./app";
import { connectDB } from "./lib/db";
import { logger } from "./lib/logger";

const PORT = parseInt(process.env.PORT) || 3000;

// Start server
app.listen(PORT, () => {
  logger.info(
    `Server listening on ${
      process.env.NODE_ENV === "development" ? "http://localhost:" : ""
    }${PORT}`
  );

  // Connect to database
  connectDB();
});
