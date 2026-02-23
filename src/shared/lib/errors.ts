export enum ErrorCode {
  UNAUTH = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_REFRESH = "INVALID_REFRESH_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  COURSE_NOT_FOUND = "COURSE_NOT_FOUND",
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(
    code: ErrorCode,
    message: string,
    statusCode = 500,
    details?: unknown,
  ) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const ErrorStatusMap: Record<ErrorCode, number> = {
  [ErrorCode.UNAUTH]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.INVALID_REFRESH]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.COURSE_NOT_FOUND]: 404,
}
