import prisma from "@/shared/lib/prisma"
import { type User } from "../../../prisma/generated/prisma/client"
import { AppError, ErrorCode } from "@/shared/lib/errors"

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found", 404)
    }

    return user
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        "User with this email not found",
        404,
      )
    }

    return user
  }

  async getUserDashboard(userId: string): Promise<any> {
    const userWithCourses = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        userCourses: {
          omit: { createdAt: true, userId: true, offeringId: true },
          include: {
            offering: {
              include: {
                course: true,
                exams: {
                  omit: { offeringId: true },
                  orderBy: {
                    examDate: "asc",
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!userWithCourses) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found", 404)
    }

    return userWithCourses
  }

  async enrollCourse(userId: string, offeringId: string): Promise<any> {
    try {
      await prisma.userCourse.create({
        data: {
          userId,
          offeringId,
        },
      })
      const course = await prisma.courseOffering.findUnique({
        where: { id: offeringId },
        include: {
          course: true,
          exams: {
            omit: { offeringId: true },
            orderBy: {
              examDate: "asc",
            },
          },
        },
      })
      return course
    } catch (error) {
      const prismaError = error as { code?: string }
      if (prismaError.code === "P2002") {
        throw new AppError(
          ErrorCode.COURSE_ALREADY_ENROLLED,
          "Course already enrolled",
          400,
        )
      }
      if (prismaError.code === "P2003") {
        throw new AppError(
          ErrorCode.COURSE_NOT_FOUND,
          "Invalid offering ID: course not found",
          400,
        )
      }
      throw error
    }
  }

  async unenrollCourse(userId: string, offeringId: string): Promise<string> {
    try {
      await prisma.userCourse.delete({
        where: {
          userId_offeringId: {
            userId,
            offeringId,
          },
        },
      })
      return "unenrolled"
    } catch (error) {
      const prismaError = error as { code?: string }
      if (prismaError.code === "P2025") {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          "Enrollment record not found",
          404,
        )
      }
      throw error
    }
  }
}

export const userService = new UserService()
