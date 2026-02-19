import { auth } from "./lib/auth"

declare global {
  namespace Express {
    interface Request {
      auth?: typeof auth.$Infer.Session
    }
  }
}
