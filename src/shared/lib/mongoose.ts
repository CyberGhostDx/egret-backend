import mongoose from "mongoose"
import { env } from "@/shared/lib/env"

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return
    await mongoose.connect(env.MONGODB_URL)
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}

export default connectMongoDB
