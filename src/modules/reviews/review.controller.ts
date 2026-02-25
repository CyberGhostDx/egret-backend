import { type NextFunction, type Request, type Response } from "express"
import { reviewService } from "./review.service"
import { AppError, ErrorCode } from "@/shared/lib/errors"
import { CreateSuccessResponse } from "@/shared/lib/response"
import {
  courseIdParamsSchema,
  createReviewSchema,
  updateReviewSchema,
  voteReviewSchema,
} from "./review.schema"
import { courseService } from "../courses/course.service"

export class ReviewController {
  async getReviewByCourseId(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = courseIdParamsSchema.parse(req.params)
      const [reviews, course, averageReview] = await Promise.all([
        reviewService.getReviewByCourseId(courseId),
        courseService.getCourseById(courseId),
        reviewService.getAverageReviewByCourseId(courseId),
      ])

      const data = {
        ...course,
        reviews,
        difficulty: averageReview,
      }
      res.json(CreateSuccessResponse(data))
    } catch (error) {
      next(error)
    }
  }

  async addReviewByCourseId(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.user.id) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized")
      }
      req.body.userId = req.auth.user.id
      req.body.username = req.auth.user.name
      const { courseId } = courseIdParamsSchema.parse(req.params)
      const data = createReviewSchema.parse(req.body)
      const newReview = await reviewService.addReviewByCourseId(courseId, data)
      res.json(CreateSuccessResponse(newReview))
    } catch (error) {
      next(error)
    }
  }

  async updateReviewByCourseId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.auth?.user.id) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized")
      }
      req.body.userId = req.auth.user.id
      const { courseId } = courseIdParamsSchema.parse(req.params)
      const data = updateReviewSchema.parse(req.body)
      const updatedReview = await reviewService.updateReviewByCourseId(
        courseId,
        data,
      )
      res.json(CreateSuccessResponse(updatedReview))
    } catch (error) {
      next(error)
    }
  }

  async softDeleteReviewByCourseId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.auth?.user.id) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized")
      }
      const userId = req.auth.user.id
      const { courseId } = courseIdParamsSchema.parse(req.params)
      const softDeletedReview = await reviewService.softDeleteReviewByCourseId(
        courseId,
        userId,
      )
      res.json(CreateSuccessResponse(softDeletedReview))
    } catch (error) {
      next(error)
    }
  }

  async addVoteByReviewId(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.user.id) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized")
      }
      const userId = req.auth.user.id
      const { reviewId } = voteReviewSchema.parse(req.params)
      const updatedReview = await reviewService.addVoteByReviewId(
        reviewId,
        userId,
      )
      res.json(CreateSuccessResponse(updatedReview))
    } catch (error) {
      next(error)
    }
  }

  async removeVoteByReviewId(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.user.id) {
        throw new AppError(ErrorCode.UNAUTH, "Unauthorized")
      }
      const userId = req.auth.user.id
      const { reviewId } = voteReviewSchema.parse(req.params)
      const updatedReview = await reviewService.removeVoteByReviewId(
        reviewId,
        userId,
      )
      res.json(CreateSuccessResponse(updatedReview))
    } catch (error) {
      next(error)
    }
  }
}

export const reviewController = new ReviewController()
