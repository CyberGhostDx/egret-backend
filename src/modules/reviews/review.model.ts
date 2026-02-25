import { Schema, model } from "mongoose"

const reviewSchema = new Schema(
  {
    courseId: String,
    userId: String,
    difficulty: Number,
    content: String,
    isAnonymous: Boolean,
    status: String,
    vote: [
      {
        userId: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const Review = model("Review", reviewSchema)
