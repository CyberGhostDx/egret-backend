import { Router } from "express";
import healthRoutes from "./modules/health/health.routes";
import userRoutes from "./modules/users/user.routes";
import { requireAuth, requireAdmin } from "./shared/middleware/auth.middleware";
import courseRoutes from "./modules/courses/course.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import adminRoutes from "./modules/admin/admin.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/users", requireAuth, userRoutes);
router.use("/courses", requireAuth, courseRoutes);
router.use("/reviews", requireAuth, reviewRoutes);
router.use("/admin", requireAdmin, adminRoutes);

export const routes = router;
