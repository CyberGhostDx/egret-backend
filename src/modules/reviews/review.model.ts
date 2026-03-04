import { Schema, model, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["published", "deleted"],
      default: "published",
    },
    vote: [
      {
        userId: {
          type: String,
          required: true,
        },
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
);

reviewSchema.index({ courseId: 1, createdAt: -1 });

export type ReviewType = InferSchemaType<typeof reviewSchema>;
export const Review = model("Review", reviewSchema);
