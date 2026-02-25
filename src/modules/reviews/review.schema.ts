import { z } from "zod"

export const createReviewSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  username: z.string().min(1, "Username is required"),
  difficulty: z.number().min(1).max(5),
  content: z.string().min(1, "Content is required"),
  isAnonymous: z.boolean().default(false),
})

export const updateReviewSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  difficulty: z.number().min(1).max(5),
  content: z.string().min(1),
})

export const voteReviewSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
})

export const courseIdParamsSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
})

export type CreateReviewSchema = z.infer<typeof createReviewSchema>
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>
export type VoteReviewSchema = z.infer<typeof voteReviewSchema>
