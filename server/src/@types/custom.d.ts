import { UserDocument } from "../api/v1/users/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
