import { type Request, type Response, type NextFunction } from "express"
import { AppError, ErrorCode } from "../lib/errors"
import { cookieConfig } from "../../config/cookies"
import { generateRandomToken } from "../lib/crypto"

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    if (!req.cookies["csrf_token"]) {
      const token = generateRandomToken(16)
      setCsrfCookie(res, token)
    }
    return next()
  }

  if (req.path.startsWith("/api/auth")) {
    return next()
  }

  const requestToken = req.headers["x-csrf-token"]

  const cookieToken = req.cookies["csrf_token"]

  if (!requestToken || !cookieToken || requestToken !== cookieToken) {
    return next(new AppError(ErrorCode.FORBIDDEN, "Forbidden", 403))
  }

  next()
}

export const setCsrfCookie = (res: Response, token: string) => {
  res.cookie("csrf_token", token, cookieConfig.csrfToken)
}
