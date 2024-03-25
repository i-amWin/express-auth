import { type UserDocument } from "../api/v1/users/user.model";
import { omit } from "./omit";

export const sanitizeUser = (
  user: UserDocument,
  fieldsToRemove: string[] = []
) => {
  const fields = [
    "password",
    "__v",
    "createdAt",
    "updatedAt",
    ...fieldsToRemove,
  ];

  return omit(user.toObject(), fields);
};
