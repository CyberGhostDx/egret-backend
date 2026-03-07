import prisma from "@/shared/lib/prisma";
import { type User } from "../../../prisma/generated/prisma/client";
import { AppError, ErrorCode } from "@/shared/lib/errors";
import { type UserDashboardResponse } from "./user.schema";

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found", 404);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        "User with this email not found",
        404,
      );
    }

    return user;
  }

  async getUserDashboard(userId: string): Promise<UserDashboardResponse> {
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
                instructors: {
                  include: { instructor: true },
                },
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
    });

    if (!userWithCourses) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found", 404);
    }

    return userWithCourses as unknown as UserDashboardResponse;
  }

  async enrollCourse(userId: string, offeringId: string): Promise<string> {
    try {
      await prisma.userCourse.create({
        data: {
          userId,
          offeringId,
        },
      });
      return "enrolled";
    } catch (error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2002") {
        throw new AppError(
          ErrorCode.COURSE_ALREADY_ENROLLED,
          "Course already enrolled",
          400,
        );
      }
      if (prismaError.code === "P2003") {
        throw new AppError(
          ErrorCode.COURSE_NOT_FOUND,
          "Invalid offering ID: course not found",
          400,
        );
      }
      throw error;
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
      });
      return "unenrolled";
    } catch (error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2025") {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          "Enrollment record not found",
          404,
        );
      }
      throw error;
    }
  }
}

export const userService = new UserService();
