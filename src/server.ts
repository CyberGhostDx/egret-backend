import { env } from "./config/env"
import app from "./app"
import connectMongoDB from "./shared/lib/mongoose"

const startServer = async () => {
  try {
    await connectMongoDB()
    app.listen(env.PORT, () => {
      console.log(`Server running at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
