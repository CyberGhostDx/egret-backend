import { Schema, model, type InferSchemaType, Types } from "mongoose"

const reviewSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
    },
    reviews: [
      {
        _id: {
          type: String,
          default: () => new Types.ObjectId().toString(),
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
          required: true,
        },
        status: {
          type: String,
          required: true,
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
    ],
  },
  {
    timestamps: true,
  },
)

export type ReviewType = InferSchemaType<typeof reviewSchema>
export const Review = model("Review", reviewSchema)
