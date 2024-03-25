import mongoose from "mongoose";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";
import { constants } from "../../../constants";

export type Role = "USER" | "ADMIN";

export interface User {
  name: string;
  email: string;
  password: string;
  role: Role;
  isTwoFactorEnabled: boolean;
}

export interface UserDocument extends User, mongoose.Document {
  comparePassword(enteredPassword: string): Promise<boolean>;
  signAccessToken(): string;
  signRefreshToken(): string;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcryptjs.hash(user.password, 8);
  next();
});

// Compare the entered password with the hashed password
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Sign an access token for the user
UserSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: constants.ACCESS_TOKEN_EXPIRY,
  });
};

// Sign a refresh token for the user
UserSchema.methods.signRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: constants.REFRESH_TOKEN_EXPIRY,
  });
};

const UsersModel = mongoose.model<UserDocument>("User", UserSchema);

export default UsersModel;
