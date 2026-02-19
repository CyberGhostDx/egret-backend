import { type Request, type Response, type NextFunction } from "express"
import { AppError, ErrorCode } from "../http/errors"
import { auth } from "../lib/auth"
import { fromNodeHeaders } from "better-auth/node"

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!session) {
      throw new AppError(ErrorCode.UNAUTH, "Unauthorized", 401)
    }

    req.auth = session
    next()
  } catch (error) {
    next(error)
  }
}
