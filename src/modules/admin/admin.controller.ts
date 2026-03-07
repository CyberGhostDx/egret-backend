import type { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";
import {
  adminDashboardSchema,
  createExamsSchema,
  reviewIdParamSchema,
} from "./admin.schema";
import { CreateSuccessResponse } from "@/shared/lib/response";

export class AdminController {
  async getDashboardInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();

      const parsedStats = adminDashboardSchema.parse(stats);

      res.json({
        success: true,
        data: parsedStats,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCourseOfferingsWithExam(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const courseOfferings =
        await adminService.getAllCourseOfferingsWithExam();

      res.json(CreateSuccessResponse(courseOfferings));
    } catch (error) {
      next(error);
    }
  }

  async createExams(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = createExamsSchema.parse(req.body);

      const result = await adminService.createExams(validatedData);

      res.status(201).json(CreateSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }
  async getAllReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const reviews = await adminService.getAllReviews();
      res.json(CreateSuccessResponse(reviews));
    } catch (error) {
      next(error);
    }
  }

  async softDeleteReviewByReviewId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { reviewId } = reviewIdParamSchema.parse(req.params);

      await adminService.softDeleteReviewByReviewId(reviewId);

      res.json(
        CreateSuccessResponse({ message: "Review deleted successfully" }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
