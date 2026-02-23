import { Router } from "express"
import { courseController } from "./course.controller"

const router = Router()

// router.get("/", courseController.getAllCourses)
router.get("/offerings", courseController.getAllCourseOfferings)
router.get("/:id", courseController.getCourseById)

export default router
