import { Router } from "express";
import { getDashboardInfo } from "./admin.controller";
import { requireAdmin } from "../../shared/middleware/auth.middleware";

const router = Router();

router.get("/dashboard", requireAdmin, getDashboardInfo);

export default router;
