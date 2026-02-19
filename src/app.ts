import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { corsOptions } from "./config/cors"
import { routes } from "./routes"
import { errorHandler } from "./http/middleware/errorHandler"
import { csrfProtection } from "./middleware/csrf.middleware"

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(csrfProtection)
app.all("/api/auth/*path", toNodeHandler(auth))
app.use(routes)
app.use(errorHandler)

export default app
