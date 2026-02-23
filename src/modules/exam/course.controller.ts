import { type NextFunction, type Request, type Response } from "express"
import { courseService } from "./course.service"
import { getCourseByIdSchema } from "./course.schema"
import { CreateSuccessResponse } from "@/shared/lib/response"

export class CourseController {
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.getAllCourses()
      res.json(CreateSuccessResponse(courses))
    } catch (error) {
      next(error)
    }
  }

  async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getCourseByIdSchema.parse(req.params)
      const course = await courseService.getCourseById(params.id)
      res.json(CreateSuccessResponse(course))
    } catch (error) {
      next(error)
    }
  }

  async getAllCourseOfferings(req: Request, res: Response, next: NextFunction) {
    try {
      const courseOfferings = await courseService.getAllCourseOfferings()
      res.json(CreateSuccessResponse(courseOfferings))
    } catch (error) {
      next(error)
    }
  }
}

export const courseController = new CourseController()
