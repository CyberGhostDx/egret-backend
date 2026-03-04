import type { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import { adminDashboardSchema } from "./admin.schema";

export const getDashboardInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
};
