import prisma from "../../shared/lib/prisma";
import { Review } from "../reviews/review.model";
import type { AdminDashboardResponse, CreateExamsInput } from "./admin.schema";

export class AdminService {
  async getDashboardStats(): Promise<AdminDashboardResponse> {
    const [totalCourseOfferings, totalExams, totalReviews] = await Promise.all([
      prisma.courseOffering.count(),
      prisma.exam.count(),
      Review.countDocuments({ status: "published" }),
    ]);

    const courses = await prisma.course.findMany({
      select: {
        id: true,
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
      .map((course) => ({
        courseName: course.titleTh || course.titleEn || "Unknown Course",
        studentCount: course.offerings.reduce(
          (acc, off) => acc + off._count.userCourses,
          0,
        ),
      }))
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5);

    return {
      totalCourseOfferings,
      totalExams,
      totalReviews,
      topCourses,
    };
  }

  async getAllCourseOfferingsWithExam() {
    return await prisma.courseOffering.findMany({
      include: {
        course: true,
        exams: {
          omit: {
            offeringId: true,
          },
          orderBy: {
            examDate: "asc",
          },
        },
      },
    });
  }

  async createExams(data: CreateExamsInput): Promise<{ count: number }> {
    return await prisma.$transaction(async (tx) => {
      let createdCount = 0;

      for (const item of data) {
        await tx.course.upsert({
          where: { id: item.courseId },
          update: {},
          create: {
            id: item.courseId,
            titleTh: item.subjectTh,
            titleEn: item.subjectEn,
          },
        });

        const offering = await tx.courseOffering.upsert({
          where: {
            courseId_section: {
              courseId: item.courseId,
              section: item.section,
            },
          },
          update: {},
          create: {
            courseId: item.courseId,
            section: item.section,
            instructorTh: item.instructorTh,
            instructorEn: item.instructorEn,
            sectionType: item.sectionType,
            credits: item.credits,
          },
        });

        const [startHour, startMin] = item.startTime.split(":").map(Number);
        const [endHour, endMin] = item.endTime.split(":").map(Number);

        const startTime = new Date(1970, 0, 1, startHour, startMin);
        const endTime = new Date(1970, 0, 1, endHour, endMin);

        // Parse date as local to avoid timezone shifting issues (especially with YYYY-MM-DD strings)
        // If it's a simple YYYY-MM-DD, parse as local. Otherwise (ISO), use new Date().
        let examDate: Date;
        if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
          const [year, month, day] = item.date.split("-").map(Number);
          examDate = new Date(year!, month! - 1, day!);
        } else {
          examDate = new Date(item.date);
        }

        await tx.exam.create({
          data: {
            offeringId: offering.id,
            examType: "final",
            examDate,
            startTime,
            endTime,
            building: item.building,
            room: item.room,
            proctor: item.proctor,
            note: item.note,
          },
        });

        createdCount++;
      }

      return { count: createdCount };
    });
  }
}

export const adminService = new AdminService();
