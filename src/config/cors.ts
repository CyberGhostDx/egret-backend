import { type CorsOptions } from "cors"
import { env } from "./env"

export const corsOptions: CorsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}
