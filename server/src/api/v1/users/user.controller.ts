import { Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsyncError } from "../../../middlewares/catch-async-error";
import { CustomError } from "../../../utils/custom-error";
import { createUserSchema, loginUserSchema } from "./user.zodSchema";
import { sanitizeUser } from "../../../utils/sanitize-user";
import mongoose from "mongoose";
import { sendTokens } from "../../../utils/jwt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../../../interfaces/response";

// ROUTE: GET /api/v1/users - [Admin]
const getUsers = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const users = await UserService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    });
  }
);

// ROUTE: GET /api/v1/users/:id - [Admin]
const getUser = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = req.params.id;

    if (!id) {
      throw new CustomError(400, "User ID is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, "Invalid user ID.");
    }

    const user = await UserService.getUserById(id);

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: sanitizeUser(user),
    });
  }
);

// ROUTE: GET /api/v1/users/me - [Authenticated User]
export const getMe = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const user = req.user;

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: sanitizeUser(user as any),
    });
  }
);

// ROUTE: POST /api/v1/users/register - [Everyone]
const registerUser = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const response = createUserSchema.safeParse(req.body);

    if (!response.success) {
      throw new CustomError(400, "Invalid name, email or password.");
    }

    const existingUser = await UserService.getUserByEmail(response.data.email);

    if (existingUser) {
      throw new CustomError(400, "User with this email already exists.");
    }

    const user = await UserService.createUser(response.data);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: sanitizeUser(user),
    });
  }
);

// ROUTE: POST /api/v1/users/login - [Everyone]
export const loginUser = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const response = loginUserSchema.safeParse(req.body);

    if (!response.success) {
      throw new CustomError(400, "Invalid email or password.");
    }

    const { email, password } = response.data;

    const user = await UserService.getUserByEmail(email);

    if (!user) {
      throw new CustomError(400, "Invalid email or password.");
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new CustomError(400, "Invalid email or password.");
    }

    sendTokens(user, res);

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      data: sanitizeUser(user),
    });
  }
);

// ROUTE: GET /api/v1/users/callback/google - [Everyone]
export const googleCallback = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const reqUser = req.user as {
      emails: { value: string }[];
      displayName: string;
    };

    let user = await UserService.getUserByEmail(
      String(reqUser.emails[0]?.value)
    );

    if (!user) {
      user = await UserService.createUser({
        name: reqUser.displayName,
        email: reqUser.emails[0]?.value!,
        password: "",
      });
    }

    sendTokens(user, res);

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// ROUTE: POST /api/v1/users/refresh-token - [Authenticated User]
export const refreshToken = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    const refreshToken = String(req.cookies.refreshToken);

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as {
      id: string;
    };

    if (!decoded) {
      throw new CustomError(401, "Invalid token.");
    }

    const user = await UserService.getUserById(decoded.id);

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    sendTokens(user, res);

    res.status(200).json({
      success: true,
      message: "Token updated successfully.",
      data: sanitizeUser(user),
    });
  }
);

// ROUTE: DELETE /api/v1/users/logout - [Authenticated User]
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response<ApiResponse>) => {
    res.clearCookie("accessToken", { sameSite: "none", secure: true });
    res.clearCookie("refreshToken", { sameSite: "none", secure: true });
    res.clearCookie("isLoggedIn", { sameSite: "none", secure: true });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
);

export const UserController = {
  getUsers,
  getUser,
  getMe,
  registerUser,
  loginUser,
  googleCallback,
  refreshToken,
  logoutUser,
};
