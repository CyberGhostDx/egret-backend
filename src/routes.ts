import { Router } from "express"
import userRoutes from "./modules/user/user.routes"
import { requireAuth } from "./shared/middleware/auth.middleware"
import courseRoutes from "./modules/exam/course.routes"

const router = Router()

router.use("/users", requireAuth, userRoutes)
router.use("/courses", requireAuth, courseRoutes)

export const routes = router
