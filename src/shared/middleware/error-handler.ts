import { type Request, type Response, type NextFunction } from "express"
import { z, ZodError } from "zod"
import { AppError, ErrorCode } from "../lib/errors"
import { CreateErrorResponse } from "../lib/response"
import { env } from "../../config/env"
import { logger } from "../lib/logger"

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error(err)

  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(CreateErrorResponse(err.code, err.message, err.details))
    return
  }

  if (err instanceof ZodError) {
    res
      .status(400)
      .json(
        CreateErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          "Validation Error",
          z.treeifyError(err),
        ),
      )
    return
  }

  // Handle SyntaxError (e.g. invalid JSON)
  if (err instanceof SyntaxError && "body" in err) {
    res
      .status(400)
      .json(
        CreateErrorResponse(ErrorCode.VALIDATION_ERROR, "Invalid JSON payload"),
      )
    return
  }

  // Default 500
  const message =
    env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err instanceof Error
        ? err.message
        : "Unknown Error"

  res
    .status(500)
    .json(CreateErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message))
}
