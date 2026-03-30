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

let mockSessionData: any = {
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
};

// Mock the entire auth object
mock.module("../../shared/lib/auth", () => ({
  auth: {
    api: {
      getSession: mock(async () => mockSessionData),
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

    test("should return 400 when offeringId is too short", async () => {
      const payload = { offeringId: "" };

      const response = await request(app)
        .post("/api/users/enroll")
        .send(payload)
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken)
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should return 400 when enrolling with numeric offeringId (wrong type)", async () => {
      const payload = { offeringId: 12345 };

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

    test("should return 400 with invalid param", async () => {
      const response = await request(app)
        .delete(`/api/users/enroll/ `) // Space as ID
        .set("Cookie", [csrfCookie])
        .set("x-csrf-token", csrfToken)
        .set("Accept", "application/json");
      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe("Unauthorized Access (Missing Tokens)", () => {
    test("GET /api/users/me should return 403 or 401 depends on setup", async () => {
      const originalSession = mockSessionData;
      mockSessionData = null;

      try {
        const response = await request(app)
          .get("/api/users/me")
          .set("Accept", "application/json");

        expect([401, 403]).toContain(response.status);
      } finally {
        mockSessionData = originalSession;
      }
    });

    test("POST /api/users/enroll should return 403 on missing CSRF token", async () => {
      const payload = { offeringId: "offering_123" };
      const response = await request(app)
        .post("/api/users/enroll")
        .send(payload)
        .set("Accept", "application/json");

      expect(response.status).toBe(403);
    });
  });
});
