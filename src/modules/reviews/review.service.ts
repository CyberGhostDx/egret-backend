import { Review } from "./review.model";
import { AppError, ErrorCode } from "@/shared/lib/errors";
import type { CreateReviewSchema, UpdateReviewSchema } from "./review.schema";

export class ReviewService {
  async getReviewByCourseId(courseId: string) {
    const reviews = await Review.find({ courseId, status: { $ne: "deleted" } })
      .sort({ createdAt: -1 })
      .lean();

    if (!reviews || reviews.length === 0) return [];

    return reviews.map((review) => {
      const {
        status,
        isAnonymous,
        userId,
        courseId: _,
        __v,
        updatedAt,
        ...cleanReview
      } = review;
      return {
        ...cleanReview,
        username: isAnonymous ? "Anonymous" : cleanReview.username,
        vote: cleanReview.vote ? cleanReview.vote.length : 0,
      };
    });
  }

  async getAverageReviewByCourseId(courseId: string) {
    const result = await Review.aggregate([
      { $match: { courseId, status: { $ne: "deleted" } } },
      {
        $group: {
          _id: null,
          averageDifficulty: { $avg: "$difficulty" },
        },
      },
    ]);

    return result.length > 0 ? Math.round(result[0].averageDifficulty) : 0;
  }

  async getAverageReviewsByCourseIds(courseIds: string[]) {
    const averages = await Review.aggregate([
      { $match: { courseId: { $in: courseIds }, status: { $ne: "deleted" } } },
      {
        $group: {
          _id: "$courseId",
          averageDifficulty: { $avg: "$difficulty" },
        },
      },
    ]);

    return averages.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.averageDifficulty;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async addReviewByCourseId(courseId: string, data: CreateReviewSchema) {
    const review = await Review.create({
      ...data,
      courseId,
      status: "published",
    });

    if (!review) {
      throw new AppError(ErrorCode.COURSE_NOT_FOUND, "Could not add review");
    }

    return review;
  }

  async updateReviewByReviewId(data: UpdateReviewSchema) {
    const review = await Review.findOneAndUpdate(
      { _id: data.reviewId, userId: data.userId, status: { $ne: "deleted" } },
      {
        $set: {
          content: data.content,
          difficulty: data.difficulty,
        },
      },
      { returnDocument: "after" },
    );

    if (!review) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found");
    }

    return review;
  }

  async softDeleteReviewByReviewId(reviewId: string, userId: string) {
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId, status: { $ne: "deleted" } },
      {
        $set: {
          status: "deleted",
        },
      },
      { returnDocument: "after" },
    );

    if (!review) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found");
    }

    return review;
  }

  async addVoteByReviewId(reviewId: string, userId: string) {
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, status: { $ne: "deleted" } },
      {
        $push: {
          vote: {
            userId,
          },
        },
      },
      { returnDocument: "after" },
    );

    if (!review) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found");
    }

    return review;
  }

  async removeVoteByReviewId(reviewId: string, userId: string) {
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, status: { $ne: "deleted" } },
      {
        $pull: {
          vote: {
            userId,
          },
        },
      },
      { returnDocument: "after" },
    );

    if (!review) {
      throw new AppError(ErrorCode.REVIEW_NOT_FOUND, "Review not found");
    }

    return review;
  }
}

export const reviewService = new ReviewService();
