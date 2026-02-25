import { Router } from "express"
import { reviewController } from "./review.controller"

const router = Router()

router.get("/:courseId", reviewController.getReviewByCourseId)
router.post("/", reviewController.addReviewByCourseId)
router.put("/", reviewController.updateReviewByCourseId)
router.delete("/", reviewController.softDeleteReviewByCourseId)
router.post("/vote", reviewController.addVoteByReviewId)
router.delete("/vote", reviewController.removeVoteByReviewId)

export default router
