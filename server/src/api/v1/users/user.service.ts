import UserModel, { User } from "./user.model";

const getUsers = () => UserModel.find();

const getUserById = (id: string) => UserModel.findById(id);

const getUserByEmail = (email: string) => UserModel.findOne({ email });

const createUser = (data: Pick<User, "name" | "email" | "password">) =>
  UserModel.create(data);

export const UserService = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
};
