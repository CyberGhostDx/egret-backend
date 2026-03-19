import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8000),
  MYSQL_DATABASE_URL: z.url(),

  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.coerce.number(),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),

  MONGODB_URL: z.url(),
  FRONTEND_URL: z.url(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.email().default("admin@egret.app"),
  ADMIN_PASSWORD: z.string().min(8).default("admin123456"),
});

export const env = envSchema.parse(process.env);
