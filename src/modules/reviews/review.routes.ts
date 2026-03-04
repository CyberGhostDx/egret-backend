import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();

router.get("/:courseId", reviewController.getReviewByCourseId);
router.post("/:courseId", reviewController.addReviewByCourseId);
// router.patch("/", reviewController.updateReviewByReviewId);
// router.delete("/:reviewId", reviewController.softDeleteReviewByReviewId);
// router.post("/:reviewId/vote", reviewController.addVoteByReviewId);
// router.delete("/:reviewId/vote", reviewController.removeVoteByReviewId);

export default router;
