import { Router } from "express";
import passport from "passport";
import { UserController } from "./user.controller";
import { isAdmin, isAuthenticated } from "../../../middlewares/auth";

const usersRouter = Router();

usersRouter.get("/", isAuthenticated, isAdmin, UserController.getUsers);
usersRouter.get("/me", isAuthenticated, UserController.getMe);
usersRouter.get("/:id", isAuthenticated, isAdmin, UserController.getUser);

usersRouter.post("/register", UserController.registerUser);
usersRouter.post("/login", UserController.loginUser);
usersRouter.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);
usersRouter.get(
  "/callback/google",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: false,
  }),
  UserController.googleCallback
);
usersRouter.post("/refresh-token", UserController.refreshToken);

usersRouter.delete("/logout", isAuthenticated, UserController.logoutUser);

export default usersRouter;
