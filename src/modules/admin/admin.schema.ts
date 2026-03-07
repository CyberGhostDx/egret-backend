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

export const createExamItemSchema = z
  .object({
    courseId: z.string().min(1),
    subjectTh: z.string().min(1),
    subjectEn: z.string().min(1),
    section: z.string().min(1),
    sectionType: z.string().min(1),
    credits: z.number().min(0),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
    endTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
    building: z.string().optional(),
    room: z.string().optional(),
    instructorTh: z.string().optional(),
    instructorEn: z.string().optional(),
    proctor: z.string().optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      const startParts = data.startTime.split(":");
      const endParts = data.endTime.split(":");
      const startHour = parseInt(startParts[0]!, 10);
      const startMin = parseInt(startParts[1]!, 10);
      const endHour = parseInt(endParts[0]!, 10);
      const endMin = parseInt(endParts[1]!, 10);
      const start = startHour * 60 + startMin;
      const end = endHour * 60 + endMin;
      return start < end;
    },
    {
      message: "startTime must be before endTime",
      path: ["startTime"],
    },
  )
  .refine(
    (data) => {
      const date = new Date(data.date);
      return !isNaN(date.getTime());
    },
    {
      message: "Invalid date format",
      path: ["date"],
    },
  );

export const createExamsSchema = z.array(createExamItemSchema);

export const updateCourseOfferingExamSchema = createExamItemSchema.extend({
  id: z.string().min(1, "Course Offering ID is required"),
  examId: z.string().min(1, "Exam ID is required"),
});

export const examIdParamSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
});

export const offeringIdParamSchema = z.object({
  offeringId: z.string().min(1, "Offering ID is required"),
});

export const reviewIdParamSchema = z.object({
  reviewId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Review ID format"),
});

export type AdminDashboardResponse = z.infer<typeof adminDashboardSchema>;
export type CreateExamsInput = z.infer<typeof createExamsSchema>;
export type UpdateCourseOfferingExamInput = z.infer<
  typeof updateCourseOfferingExamSchema
>;
export type ReviewIdParam = z.infer<typeof reviewIdParamSchema>;
