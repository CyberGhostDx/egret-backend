import { expect, test, describe } from "bun:test";
import {
  examSchema,
  courseSchema,
  mongoIdSchema,
  courseIdParamSchema,
  offeringIdParamSchema,
} from "./schema";

describe("Shared Schemas Validation", () => {
  describe("mongoIdSchema", () => {
    test("should validate a valid MongoDB ID", () => {
      const validId = "507f1f77bcf86cd799439011";
      const result = mongoIdSchema.safeParse(validId);
      expect(result.success).toBe(true);
    });

    test("should fail for an invalid MongoDB ID", () => {
      const invalidId = "invalid-id";
      const result = mongoIdSchema.safeParse(invalidId);
      expect(result.success).toBe(false);
    });

    test("should fail for a short MongoDB ID", () => {
      const shortId = "507f1f77";
      const result = mongoIdSchema.safeParse(shortId);
      expect(result.success).toBe(false);
    });
  });

  describe("courseSchema", () => {
    test("should validate a valid course object", () => {
      const validCourse = {
        id: "CS101",
        titleTh: "วิทยาการคอมพิวเตอร์พื้นฐาน",
        titleEn: "Basic Computer Science",
      };
      const result = courseSchema.safeParse(validCourse);
      expect(result.success).toBe(true);
    });

    test("should allow nullable titleEn", () => {
      const course = {
        id: "CS101",
        titleTh: "ภาษาไทย",
        titleEn: null,
      };
      const result = courseSchema.safeParse(course);
      expect(result.success).toBe(true);
    });

    test("should fail if id is missing", () => {
      const invalidCourse = {
        titleTh: "วิทยาการคอมพิวเตอร์",
      };
      const result = courseSchema.safeParse(invalidCourse);
      expect(result.success).toBe(false);
    });
  });

  describe("examSchema", () => {
    test("should validate a valid exam object", () => {
      const validExam = {
        id: "EX1",
        examType: "MIDTERM",
        examDate: "2024-05-20",
        startTime: "2024-05-20T09:00:00Z",
        endTime: "2024-05-20T12:00:00Z",
        building: "B1",
        room: "101",
        note: "Bring calculator",
        proctor: "Dr. Smith",
        updatedAt: "2024-03-30T10:00:00Z",
      };
      const result = examSchema.safeParse(validExam);
      expect(result.success).toBe(true);
    });

    test("should coerce dates correctly", () => {
      const exam = {
        id: "EX2",
        examType: "FINAL",
        examDate: "2024-12-15",
        startTime: "2024-12-15T13:00:00Z",
        endTime: "2024-12-15T16:00:00Z",
        updatedAt: "2024-11-01T08:00:00Z",
        building: null,
        room: null,
        note: null,
        proctor: null,
      };
      const result = examSchema.safeParse(exam);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.examDate).toBeInstanceOf(Date);
      }
    });
  });

  describe("courseIdParamSchema", () => {
    test("should validate valid courseId parameter", () => {
      const result = courseIdParamSchema.safeParse({ courseId: "CS101" });
      expect(result.success).toBe(true);
    });

    test("should fail for empty courseId", () => {
      const result = courseIdParamSchema.safeParse({ courseId: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("offeringIdParamSchema", () => {
    test("should validate valid offeringId parameter", () => {
      const result = offeringIdParamSchema.safeParse({ offeringId: "OFF-1" });
      expect(result.success).toBe(true);
    });

    test("should fail if offeringId is missing", () => {
      const result = offeringIdParamSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
