import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const catchAsyncError =
  (asyncHandler: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
