import { pinoHttp } from "pino-http";
import { logger } from "../lib/logger";

export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === "/api/health",
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
  customProps: (req: any) => ({
    userId: req.auth?.user?.id || "anonymous",
    userName: req.auth?.user?.name || "anonymous",
  }),
});
