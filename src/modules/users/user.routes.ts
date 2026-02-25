import { Router } from "express"
import { userController } from "./user.controller"

const router = Router()

router.get("/me", userController.getMe)
router.post("/enroll", userController.enrollCourse)
router.delete("/enroll/:offeringId", userController.unenrollCourse)

export default router
