import { CookieOptions, Response } from "express";
import { UserDocument } from "../api/v1/users/user.model";
import { constants } from "../constants";

const accessTokenOptions: CookieOptions = {
  expires: new Date(Date.now() + constants.ACCESS_TOKEN_EXPIRY * 1000),
  maxAge: constants.ACCESS_TOKEN_EXPIRY * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const refreshTokenOptions: CookieOptions = {
  expires: new Date(Date.now() + constants.REFRESH_TOKEN_EXPIRY * 1000),
  maxAge: constants.REFRESH_TOKEN_EXPIRY * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const isLoggedInOptions: CookieOptions = {
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  expires: new Date(Date.now() + constants.REFRESH_TOKEN_EXPIRY * 1000),
  maxAge: constants.REFRESH_TOKEN_EXPIRY * 1000,
};

export const sendTokens = (user: UserDocument, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  res.cookie("isLoggedIn", "true", isLoggedInOptions);
};
