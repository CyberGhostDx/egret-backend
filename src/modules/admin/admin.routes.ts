import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/dashboard", adminController.getDashboardInfo);
router.get("/courses/offerings", adminController.getAllCourseOfferingsWithExam);
router.get("/reviews", adminController.getAllReviews);
router.delete("/reviews/:reviewId", adminController.softDeleteReviewByReviewId);
router.patch(
  "/reviews/:reviewId/restore",
  adminController.restoreReviewByReviewId,
);
router.post("/exam", adminController.createExams);
router.patch("/exams", adminController.updateExam);
router.delete("/exams/:examId", adminController.deleteExam);
router.delete("/offerings/:offeringId", adminController.deleteOffering);
export default router;
