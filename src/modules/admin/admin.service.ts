import prisma from "../../shared/lib/prisma";
import { Review } from "../reviews/review.model";
import type { AdminDashboardResponse } from "./admin.schema";

export const getDashboardStats = async (): Promise<AdminDashboardResponse> => {
  const [totalCourseOfferings, totalExams, totalReviews] = await Promise.all([
    prisma.courseOffering.count(),
    prisma.exam.count(),
    Review.countDocuments({ status: "published" }),
  ]);

  const courses = await prisma.course.findMany({
    select: {
      titleTh: true,
      titleEn: true,
      offerings: {
        select: {
          _count: {
            select: {
              userCourses: true,
            },
          },
        },
      },
    },
  });

  const topCourses = courses
    .map((course: any) => ({
      courseName: course.titleTh || course.titleEn || "Unknown Course",
      studentCount: course.offerings.reduce(
        (acc: number, off: any) => acc + off._count.userCourses,
        0,
      ),
    }))
    .sort((a: any, b: any) => b.studentCount - a.studentCount)
    .slice(0, 5);

  return {
    totalCourseOfferings,
    totalExams,
    totalReviews,
    topCourses,
  };
};
