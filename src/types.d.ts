import { auth } from "./shared/lib/auth";

declare global {
  namespace Express {
    interface Request {
      auth?: typeof auth.$Infer.Session;
    }
  }
}
