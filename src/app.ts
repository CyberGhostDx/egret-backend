import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./shared/lib/auth";
import { corsOptions } from "./config/cors";
import { routes } from "./routes";
import { errorHandler } from "./shared/middleware/error-handler";
import { csrfProtection } from "./shared/middleware/csrf.middleware";
import { requestLogger } from "./shared/middleware/logger.middleware";

const app = express();

app.use(requestLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(csrfProtection);
app.all("/api/auth/*path", toNodeHandler(auth));
app.use("/api", routes);
app.use(errorHandler);

export default app;
