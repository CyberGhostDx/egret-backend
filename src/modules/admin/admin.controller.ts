import type { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";
import { adminDashboardSchema, createExamsSchema } from "./admin.schema";

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

      res.json({
        success: true,
        data: courseOfferings,
      });
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

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
