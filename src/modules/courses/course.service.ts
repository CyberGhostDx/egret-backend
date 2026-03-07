import prisma from "@/shared/lib/prisma";
import { AppError, ErrorCode } from "@/shared/lib/errors";

export class CourseService {
  async getAllCourses() {
    return prisma.course.findMany();
  }

  async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });
    if (!course) {
      throw new AppError(ErrorCode.COURSE_NOT_FOUND, "Course not found");
    }
    return course;
  }

  async getAllCourseOfferings() {
    const courseOfferings = await prisma.course.findMany({
      include: {
        offerings: {
          include: {
            instructors: {
              include: { instructor: true },
            },
          },
        },
      },
    });

    return courseOfferings;
  }
}

export const courseService = new CourseService();
