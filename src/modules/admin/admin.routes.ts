import { Router } from "express";
import { adminController } from "./admin.controller";
import { requireAdmin } from "../../shared/middleware/auth.middleware";

const router = Router();

router.get("/dashboard", requireAdmin, adminController.getDashboardInfo);
router.get(
  "/courses/offerings",
  requireAdmin,
  adminController.getAllCourseOfferingsWithExam,
);
router.post("/exam", requireAdmin, adminController.createExams);

export default router;
