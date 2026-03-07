import type { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";
import {
  adminDashboardSchema,
  createExamsSchema,
  examIdParamSchema,
  offeringIdParamSchema,
  reviewIdParamSchema,
  updateCourseOfferingExamSchema,
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

  async restoreReviewByReviewId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { reviewId } = reviewIdParamSchema.parse(req.params);

      await adminService.restoreReviewByReviewId(reviewId);

      res.json(
        CreateSuccessResponse({ message: "Review restored successfully" }),
      );
    } catch (error) {
      next(error);
    }
  }

  async updateExam(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = updateCourseOfferingExamSchema.parse(req.body);

      const result = await adminService.updateExam(validatedData);

      res.json(CreateSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async deleteExam(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { examId } = examIdParamSchema.parse(req.params);

      await adminService.deleteExamById(examId);

      res.json(CreateSuccessResponse({ message: "Exam deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }

  async deleteOffering(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { offeringId } = offeringIdParamSchema.parse(req.params);

      await adminService.deleteOfferingById(offeringId);

      res.json(
        CreateSuccessResponse({ message: "Offering deleted successfully" }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
