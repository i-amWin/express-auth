import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../interfaces/response";

export const notFoundMiddleware = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
