import { Router } from "express"
import userRoutes from "./modules/user/user.routes"
import { requireAuth } from "./shared/middleware/auth.middleware"

const router = Router()

router.use("/users", requireAuth, userRoutes)

export const routes = router
