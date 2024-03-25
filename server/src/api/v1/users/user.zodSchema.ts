import * as z from "zod";

// Zod schema for creating a user
export const createUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8),
});

// Zod schema for logging in a user
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
