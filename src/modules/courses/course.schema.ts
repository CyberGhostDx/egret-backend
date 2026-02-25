import { z } from "zod"

export const getCourseByIdSchema = z.object({
  id: z.string("Required Course Id"),
})

export type GetCourseByIdDto = z.infer<typeof getCourseByIdSchema>
