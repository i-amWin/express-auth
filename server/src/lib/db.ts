import { connect } from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI).then((data) => {
      logger.info(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    logger.error(error.message);
    setTimeout(connectDB, 5000);
  }
};
