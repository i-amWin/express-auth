import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";

import { errorMiddleware } from "./middlewares/error-middleware";
import { notFoundMiddleware } from "./middlewares/not-found-middleware";

import apiRouter from "./api";
import { morganMiddleware } from "./middlewares/morgan-middleware";
import { sendTokens } from "./utils/jwt";
import { UserService } from "./api/v1/users/user.service";

import "./lib/oauth";

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cookieParser());
app.use(morganMiddleware);
app.use(passport.initialize());

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.use("/api", apiRouter);

// Error middleware
app.use(errorMiddleware);

// Not found middleware
app.use(notFoundMiddleware);

export default app;
