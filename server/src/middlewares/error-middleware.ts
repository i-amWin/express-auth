import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";
import { Error as MError } from "mongoose";
import { ApiResponse } from "../interfaces/response";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  switch (true) {
    case err instanceof CustomError:
      statusCode = err.statusCode;
      message = err.message;
      break;

    case err instanceof MError.CastError:
      statusCode = 400;
      message = `Resource not found. Invalid: ${err.path}`;
      break;

    case err && typeof err === "object" && "code" in err && err.code === 11000:
      statusCode = 400;
      message = `Duplicate ${Object.keys((err as any).keyValue)} value entered`;
      break;

    case err instanceof JsonWebTokenError:
      statusCode = 401;
      message = "Unauthorized. Invalid token.";
      break;

    case err instanceof Error:
      message = err.message;
      break;

    case err && typeof err === "object" && "message" in err:
      message = String(err.message);
      break;

    case typeof err === "string":
      message = err;
      break;

    default:
      break;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
