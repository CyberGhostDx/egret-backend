import { z } from "zod";
import {
  courseOfferingSchema,
  offeringIdParamSchema,
} from "@/shared/schemas/schema";

export const enrollCourseSchema = offeringIdParamSchema;

export type EnrollCourseDto = z.infer<typeof enrollCourseSchema>;

export const userCourseSchema = z.object({
  offering: courseOfferingSchema,
});

export const userDashboardSchema = z.object({
  name: z.string().nullable(),
  email: z.string(),
  userCourses: z.array(userCourseSchema),
});

export type UserDashboardResponse = z.infer<typeof userDashboardSchema>;
