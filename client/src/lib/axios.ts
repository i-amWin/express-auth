import axios from "axios";
import z from "zod";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  // withCredentials: true,
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.union([z.literal("USER"), z.literal("ADMIN")]),
  isTwoFactorAuthEnabled: z.boolean(),
});

export const userResponseSchema = z.union([
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: userSchema.optional(),
  }),
]);

export type User = z.infer<typeof userSchema>;
export type ApiResponse = z.infer<typeof userResponseSchema>;
