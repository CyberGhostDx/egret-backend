import type { NextFunction, Request, Response } from "express"
import { userService } from "./user.service"
import { enrollCourseSchema } from "./user.schema"
import { AppError, ErrorCode } from "@/shared/lib/errors"
import { CreateSuccessResponse } from "@/shared/lib/response"

export class UserController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.user.id
      if (!userId) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized", 401)
      }

      const dashboard = await userService.getUserDashboard(userId)
      res.json(CreateSuccessResponse(dashboard))
    } catch (error) {
      next(error)
    }
  }

  async enrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.user.id
      if (!userId) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized", 401)
      }

      const { offeringId } = enrollCourseSchema.parse(req.body)
      const result = await userService.enrollCourse(userId, offeringId)

      res.json(CreateSuccessResponse(result))
    } catch (error) {
      next(error)
    }
  }

  async unenrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.user.id
      if (!userId) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized", 401)
      }

      const { offeringId } = enrollCourseSchema.parse(req.params)
      const result = await userService.unenrollCourse(userId, offeringId)

      res.json(CreateSuccessResponse(result))
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()
