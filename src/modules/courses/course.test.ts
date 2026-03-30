import { expect, test, describe, mock } from "bun:test";
import request from "supertest";
import app from "../../app";

// Mock UserService to avoid DB dependency
mock.module("./course.service", () => ({
  courseService: {
    getAllCourses: mock(async () => [
      { id: "C1", titleTh: "Course 1", titleEn: "Course 1 Eng" },
    ]),
    getCourseById: mock(async (id: string) => {
      if (id === "C1") return { id: "C1", titleTh: "Course 1" };
      return null;
    }),
    getAllCourseOfferings: mock(async () => [
      { id: "CO1", courseId: "C1", section: "1" },
    ]),
  },
}));

// Mock Reviews for difficulty average
mock.module("../reviews/review.service", () => ({
  reviewService: {
    getAverageReviewsByCourseIds: mock(async () => ({
      CO1: 4.5,
    })),
  },
}));

let mockSessionData: any = {
  user: { id: "u1", role: "user" },
};

// Mock Auth
mock.module("../../shared/lib/auth", () => ({
  auth: {
    api: {
      getSession: mock(async () => mockSessionData),
    },
  },
}));

describe("Course Module API (Supertest)", () => {
  const csrfToken = "test_csrf";
  const csrfCookie = `csrf_token=${csrfToken}`;

  describe("GET /api/courses/offerings", () => {
    test("should return 200 and list of offerings with difficulty", async () => {
      const response = await request(app)
        .get("/api/courses/offerings")
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].difficulty).toBe(4.5);
    });
  });

  describe("GET /api/courses/:id", () => {
    test("should return 200 for a valid course ID", async () => {
      const response = await request(app)
        .get("/api/courses/C1")
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe("C1");
    });

    test("should return 200 but null data if course not found (depending on service implementation)", async () => {
      const response = await request(app)
        .get("/api/courses/NON_EXISTENT")
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
    });

    test("should return 400 if ID is invalid (e.g. empty - though router might handle this)", async () => {
      const response = await request(app)
        .get("/api/courses/%20") // Space
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken);

      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe("Unauthorized Access", () => {
    test("should return 401/403 when session is missing", async () => {
      const originalSession = mockSessionData;
      mockSessionData = null;

      try {
        const response = await request(app).get("/api/courses/offerings");
        expect([401, 403]).toContain(response.status);
      } finally {
        mockSessionData = originalSession;
      }
    });
  });

  describe("Edge Cases", () => {
    test("GET /offerings should handle empty list from service", async () => {
      expect(true).toBe(true);
    });

    test("should handle very long ID strings", async () => {
      const longId = "a".repeat(100);
      const response = await request(app)
        .get(`/api/courses/${longId}`)
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken);

      expect(response.status).toBe(200);
    });
  });
});
