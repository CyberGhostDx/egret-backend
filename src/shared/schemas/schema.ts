import { z } from "zod"

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
