import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.string(),
  CLIENT_URL: z.string(),
  MONGO_URI: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
