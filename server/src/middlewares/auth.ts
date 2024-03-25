import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catch-async-error";
import { CustomError } from "../utils/custom-error";
import jwt from "jsonwebtoken";
import { UserService } from "../api/v1/users/user.service";

// This middleware will check if the user is authenticated
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = String(req.cookies.accessToken);

    if (!accessToken) {
      throw new CustomError(401, "Please login to access this resource.");
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    ) as {
      id: string;
    };

    if (!decoded) {
      throw new CustomError(401, "Invalid access token.");
    }

    const user = await UserService.getUserById(decoded.id);

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    req.user = user;
    next();
  }
);

// This middleware will check if the user is an admin
export const isAdmin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
      throw new CustomError(
        403,
        `Role '${req.user?.role}' is not allowed to access this resource.`
      );
    }
    next();
  }
);
