import { Review } from "./review.model"
import { AppError, ErrorCode } from "@/shared/lib/errors"
import type { CreateReviewSchema, UpdateReviewSchema } from "./review.schema"

export class ReviewService {
  async getReviewByCourseId(courseId: string) {
    const doc = await Review.findOne({ courseId })
    if (!doc) return []

    return doc.reviews
      .filter((review) => review.status !== "deleted")
      .map((review) => {
        const reviewObj = review.toObject()
        const { status, isAnonymous, userId, ...cleanReview } = reviewObj
        return {
          ...cleanReview,
          username: isAnonymous ? "Anonymous" : cleanReview.username,
          vote: cleanReview.vote ? cleanReview.vote.length : 0,
        }
      })
  }

  async getAverageReviewByCourseId(courseId: string) {
    const doc = await Review.findOne({ courseId })
    if (!doc || doc.reviews.length === 0) return 0

    const activeReviews = doc.reviews.filter((r) => r.status !== "deleted")
    if (activeReviews.length === 0) return 0

    const sum = activeReviews.reduce(
      (acc, review) => acc + review.difficulty,
      0,
    )
    return sum / activeReviews.length
  }

  async getAverageReviewsByCourseIds(courseIds: string[]) {
    const averages = await Review.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $unwind: "$reviews" },
      { $match: { "reviews.status": { $ne: "deleted" } } },
      {
        $group: {
          _id: "$courseId",
          averageDifficulty: { $avg: "$reviews.difficulty" },
        },
      },
    ])

    return averages.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.averageDifficulty
        return acc
      },
      {} as Record<string, number>,
    )
  }

  async addReviewByCourseId(courseId: string, data: CreateReviewSchema) {
    const updatedDoc = await Review.findOneAndUpdate(
      { courseId },
      {
        $push: {
          reviews: {
            ...data,
            status: "active",
            vote: [],
          },
        },
      },
      { upsert: true, returnDocument: "after" },
    )

    if (!updatedDoc) {
      throw new AppError(ErrorCode.COURSE_NOT_FOUND, "Could not add review")
    }

    return updatedDoc.reviews[updatedDoc.reviews.length - 1]
  }

  async updateReviewByCourseId(courseId: string, data: UpdateReviewSchema) {
    const updatedDoc = await Review.findOneAndUpdate(
      { courseId, "reviews.userId": data.userId },
      {
        $set: {
          "reviews.$.content": data.content,
          "reviews.$.difficulty": data.difficulty,
        },
      },
      { returnDocument: "after" },
    )

    if (!updatedDoc) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found")
    }

    return updatedDoc.reviews.find((r) => r.userId === data.userId)
  }

  async softDeleteReviewByCourseId(courseId: string, userId: string) {
    const updatedDoc = await Review.findOneAndUpdate(
      { courseId, "reviews.userId": userId },
      {
        $set: {
          "reviews.$.status": "deleted",
        },
      },
      { returnDocument: "after" },
    )

    if (!updatedDoc) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found")
    }

    return updatedDoc.reviews.find((r) => r.userId === userId)
  }

  async addVoteByReviewId(reviewId: string, userId: string) {
    const updatedDoc = await Review.findOneAndUpdate(
      { "reviews._id": reviewId },
      {
        $push: {
          "reviews.$.vote": {
            userId,
          },
        },
      },
      { returnDocument: "after" },
    )

    if (!updatedDoc) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found")
    }

    return updatedDoc.reviews.id(reviewId)
  }

  async removeVoteByReviewId(reviewId: string, userId: string) {
    const updatedDoc = await Review.findOneAndUpdate(
      { "reviews._id": reviewId },
      {
        $pull: {
          "reviews.$.vote": {
            userId,
          },
        },
      },
      { returnDocument: "after" },
    )

    if (!updatedDoc) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found")
    }

    return updatedDoc.reviews.id(reviewId)
  }
}

export const reviewService = new ReviewService()
