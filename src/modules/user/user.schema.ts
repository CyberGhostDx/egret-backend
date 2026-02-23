import { z } from "zod"
import { courseOfferingSchema } from "@/shared/schemas/schema"

export const enrollCourseSchema = z.object({
  offeringId: z.string().min(1, "Offering ID is required"),
})

export type EnrollCourseDto = z.infer<typeof enrollCourseSchema>

export const userCourseSchema = z.object({
  userId: z.string(),
  offeringId: z.string(),
  offering: courseOfferingSchema,
})

export const userDashboardSchema = z.object({
  name: z.string().nullable(),
  email: z.string(),
  userCourses: z.array(userCourseSchema),
})

export type UserDashboardResponse = z.infer<typeof userDashboardSchema>
