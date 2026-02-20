import { z } from "zod"

export const enrollCourseSchema = z.object({
  offeringId: z.string().min(1, "Offering ID is required"),
})

export type EnrollCourseDto = z.infer<typeof enrollCourseSchema>
