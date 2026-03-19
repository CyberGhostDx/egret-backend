import mongoose from "mongoose";
import prisma from "@/shared/lib/prisma";
import type { StatusResponse } from "./health.schema";

export class HealthService {
  async getHealthStatus(): Promise<StatusResponse> {
    await Promise.all([
      prisma.$queryRaw`SELECT 1`,
      (async () => {
        if (mongoose.connection.readyState !== 1) {
          throw new Error("MongoDB is not connected");
        }
        await mongoose.connection.db?.admin().command({ ping: 1 });
      })(),
    ]);

    return {
      status: "ok",
    };
  }
}

export const healthService = new HealthService();
