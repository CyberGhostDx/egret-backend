import { z } from "zod";

import { courseIdSchema } from "@/shared/schemas/schema";

export const getCourseByIdSchema = courseIdSchema;

export type GetCourseByIdDto = z.infer<typeof getCourseByIdSchema>;
