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
          omit: { createdAt: true },
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

  async enrollCourse(
    userId: string,
    offeringId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await prisma.userCourse.create({
        data: {
          userId,
          offeringId,
        },
      })
      return { success: true }
    } catch (error) {
      const prismaError = error as { code?: string }
      if (prismaError.code === "P2002") {
        return { success: false, message: "Course already enrolled" }
      }
      throw error
    }
  }

  async unenrollCourse(
    userId: string,
    offeringId: string,
  ): Promise<{ success: boolean }> {
    try {
      await prisma.userCourse.delete({
        where: {
          userId_offeringId: {
            userId,
            offeringId,
          },
        },
      })
      return { success: true }
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
