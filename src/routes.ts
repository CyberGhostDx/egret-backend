import { Router } from "express"
import userRoutes from "./modules/users/user.routes"
import { requireAuth } from "./shared/middleware/auth.middleware"
import courseRoutes from "./modules/courses/course.routes"
import reviewRoutes from "./modules/reviews/review.routes"

const router = Router()

router.use("/users", requireAuth, userRoutes)
router.use("/courses", requireAuth, courseRoutes)
router.use("/reviews", requireAuth, reviewRoutes)

export const routes = router
