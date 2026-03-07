import prisma from "../../shared/lib/prisma";
import type {
  AdminDashboardResponse,
  CreateExamsInput,
  UpdateCourseOfferingExamInput,
} from "./admin.schema";
import { AppError, ErrorCode } from "../../shared/lib/errors";
import { Review } from "../reviews/review.model";

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

        let examDate: Date;
        if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
          const [year, month, day] = item.date.split("-").map(Number);
          examDate = new Date(year!, month! - 1, day!);
        } else {
          examDate = new Date(item.date);
        }

        const existingExam = await tx.exam.findFirst({
          where: {
            offeringId: offering.id,
            examDate: examDate,
            startTime: startTime,
            endTime: endTime,
            room: item.room || null,
          },
        });

        if (existingExam) continue;

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

  async getAllReviews() {
    const allReviews = await Review.find().sort({ createdAt: -1 }).lean();
    if (!allReviews || allReviews.length === 0) return [];

    const courseIds = [
      ...new Set(allReviews.map((r: any) => r.courseId as string)),
    ];

    const [courses, averages] = await Promise.all([
      prisma.course.findMany({
        where: { id: { in: courseIds } },
      }),
      Review.aggregate([
        {
          $match: { courseId: { $in: courseIds }, status: { $ne: "deleted" } },
        },
        {
          $group: {
            _id: "$courseId",
            averageDifficulty: { $avg: "$difficulty" },
          },
        },
      ]),
    ]);

    const averageMap = averages.reduce(
      (acc, curr) => {
        acc[curr._id] = Math.round(curr.averageDifficulty);
        return acc;
      },
      {} as Record<string, number>,
    );

    const courseMap = new Map(courses.map((c) => [c.id, c]));

    const reviewsByCourseMap = allReviews.reduce(
      (acc, review: any) => {
        const cid = review.courseId;
        if (!acc[cid]) acc[cid] = [];
        acc[cid].push({
          ...review,
          vote: review.vote ? review.vote.length : 0,
        });
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return courseIds.map((courseId) => {
      const course = courseMap.get(courseId) || { id: courseId };
      return {
        ...course,
        reviews: reviewsByCourseMap[courseId] || [],
        difficulty: averageMap[courseId] || 0,
      };
    });
  }

  async softDeleteReviewByReviewId(reviewId: string) {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status: "deleted" },
      { returnDocument: "after" },
    );

    if (!updatedReview) {
      throw new AppError(
        ErrorCode.REVIEW_NOT_FOUND,
        `Review with ID ${reviewId} not found`,
      );
    }

    return updatedReview;
  }

  async restoreReviewByReviewId(reviewId: string) {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status: "published" },
      { returnDocument: "after" },
    );

    if (!updatedReview) {
      throw new AppError(
        ErrorCode.REVIEW_NOT_FOUND,
        `Review with ID ${reviewId} not found`,
      );
    }

    return updatedReview;
  }

  async updateExam(data: UpdateCourseOfferingExamInput) {
    return await prisma.$transaction(async (tx) => {
      await tx.course.upsert({
        where: { id: data.courseId },
        update: {
          titleTh: data.subjectTh,
          titleEn: data.subjectEn,
        },
        create: {
          id: data.courseId,
          titleTh: data.subjectTh,
          titleEn: data.subjectEn,
        },
      });

      const offering = await tx.courseOffering.update({
        where: { id: data.id },
        data: {
          courseId: data.courseId,
          section: data.section,
          instructorTh: data.instructorTh,
          instructorEn: data.instructorEn,
          sectionType: data.sectionType,
          credits: data.credits,
        },
      });

      const [startHour, startMin] = data.startTime.split(":").map(Number);
      const [endHour, endMin] = data.endTime.split(":").map(Number);

      const startTime = new Date(1970, 0, 1, startHour, startMin);
      const endTime = new Date(1970, 0, 1, endHour, endMin);

      let examDate: Date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        const [year, month, day] = data.date.split("-").map(Number);
        examDate = new Date(year!, month! - 1, day!);
      } else {
        examDate = new Date(data.date);
      }

      const exam = await tx.exam.update({
        where: { id: data.examId },
        data: {
          examDate,
          startTime,
          endTime,
          building: data.building,
          room: data.room,
          proctor: data.proctor,
          note: data.note,
        },
      });

      return { offering, exam };
    });
  }

  async deleteExamById(examId: string) {
    return await prisma.exam.delete({
      where: { id: examId },
    });
  }

  async deleteOfferingById(offeringId: string) {
    return await prisma.courseOffering.delete({
      where: { id: offeringId },
    });
  }
}

export const adminService = new AdminService();
