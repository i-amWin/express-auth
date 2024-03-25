import { Router } from "express";
import usersRouter from "./users/user.routes";

const v1Router = Router();

v1Router.use("/users", usersRouter);

export default v1Router;
