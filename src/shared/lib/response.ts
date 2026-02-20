export interface SuccessResponse<T> {
  success: true
  data: T
}

export const CreateSuccessResponse = <T>(data: T): SuccessResponse<T> => {
  return {
    success: true,
    data,
  }
}

export interface ErrorDetail {
  code: string
  message: string
  details?: unknown
}

export interface ErrorResponse {
  success: false
  error: ErrorDetail
}

export const CreateErrorResponse = (
  code: string,
  message: string,
  details?: unknown,
): ErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  }
}
