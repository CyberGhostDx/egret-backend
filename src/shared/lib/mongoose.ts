import mongoose from "mongoose"
import { env } from "@/shared/lib/env"

import { logger } from "./logger"

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return
    await mongoose.connect(env.MONGODB_URL)
  } catch (error) {
    logger.error(error, "MongoDB connection error")
  }
}

export default connectMongoDB
