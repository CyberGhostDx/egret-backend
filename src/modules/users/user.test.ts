import { expect, test, describe, mock } from "bun:test";
import request from "supertest";
import app from "../../app";

mock.module("./user.service", () => ({
  userService: {
    getUserDashboard: mock(async () => ({
      name: "Test User",
      email: "test@example.com",
      userCourses: [],
    })),
    enrollCourse: mock(async () => "enrolled"),
    unenrollCourse: mock(async () => "unenrolled"),
  },
}));

mock.module("../../shared/lib/auth", () => ({
  auth: {
    api: {
      getSession: mock(async () => ({
        user: {
          id: "user_test_id",
          name: "Test User",
          email: "test@example.com",
          role: "user",
          banned: false,
        },
        session: {
          id: "session_test_id",
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      })),
    },
  },
}));

describe("User Module API (Supertest)", () => {
  const csrfToken = "test_csrf_token";
  const csrfCookie = `csrf_token=${csrfToken}`;

  describe("GET /api/users/me", () => {
    test("should return 200 and user dashboard data", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("test@example.com");
    });
  });

  describe("POST /api/users/enroll", () => {
    test("should return 200 when enrolling in a course with valid payload", async () => {
      const payload = {
        offeringId: "offering_123",
      };

      const response = await request(app)
        .post("/api/users/enroll")
        .send(payload)
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBe("enrolled");
    });

    test("should return 400 when enrolling with an invalid payload (missing offeringId)", async () => {
      const payload = {};

      const response = await request(app)
        .post("/api/users/enroll")
        .send(payload)
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken)
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/users/enroll/:offeringId", () => {
    test("should return 200 when unenrolling from a course", async () => {
      const offeringId = "offering_123";

      const response = await request(app)
        .delete(`/api/users/enroll/${offeringId}`)
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBe("unenrolled");
    });
  });
});
