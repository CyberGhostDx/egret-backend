import { z } from "zod"

export const enrollCourseSchema = z.object({
  offeringId: z.string().min(1, "Offering ID is required"),
})

export type EnrollCourseDto = z.infer<typeof enrollCourseSchema>

export const examSchema = z.object({
  id: z.string(),
  examType: z.string(),
  examDate: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  building: z.string().nullable(),
  room: z.string().nullable(),
  note: z.string().nullable(),
  proctor: z.string().nullable(),
  updatedAt: z.coerce.date(),
})

export const courseSchema = z.object({
  id: z.string(),
  titleTh: z.string(),
  titleEn: z.string().nullable(),
})

export const courseOfferingSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  section: z.string(),
  instructorTh: z.string().nullable(),
  instructorEn: z.string().nullable(),
  sectionType: z.string().nullable(),
  credits: z.coerce.number(),
  course: courseSchema,
  exams: z.array(examSchema),
})

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
