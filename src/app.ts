import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

export default app
