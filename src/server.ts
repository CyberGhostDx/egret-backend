import { env } from "./config/env"
import app from "./app"
import connectMongoDB from "./shared/lib/mongoose"
import { logger } from "./shared/lib/logger"

const startServer = async () => {
  try {
    await connectMongoDB()
    app.listen(env.PORT, () => {
      logger.info(`Server running at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error(error, "Failed to start server")
    process.exit(1)
  }
}

startServer()
