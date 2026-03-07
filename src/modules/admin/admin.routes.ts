import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/dashboard", adminController.getDashboardInfo);
router.get("/courses/offerings", adminController.getAllCourseOfferingsWithExam);
router.get("/reviews", adminController.getAllReviews);
router.delete("/reviews/:reviewId", adminController.softDeleteReviewByReviewId);
router.post("/exam", adminController.createExams);
export default router;
