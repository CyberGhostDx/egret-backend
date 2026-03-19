import type { Request, Response, NextFunction } from "express"
import { healthService } from "./health.service"
import { CreateSuccessResponse } from "@/shared/lib/response"

export class HealthController {
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await healthService.getHealthStatus()
      res.json(CreateSuccessResponse(status))
    } catch (error) {
      next(error)
    }
  }
}

export const healthController = new HealthController()
