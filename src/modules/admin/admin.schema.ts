import { z } from "zod";

export const adminDashboardSchema = z.object({
  totalCourseOfferings: z.number(),
  totalExams: z.number(),
  totalReviews: z.number(),
  topCourses: z.array(
    z.object({
      courseName: z.string(),
      studentCount: z.number(),
    }),
  ),
});

export type AdminDashboardResponse = z.infer<typeof adminDashboardSchema>;
