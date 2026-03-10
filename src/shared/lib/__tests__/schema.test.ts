import { describe, expect, test } from "bun:test";
import { userDashboardSchema } from "../../../modules/users/user.schema";

describe("User Zod Schema Validation", () => {
  test("userDashboardSchema should validate correct data", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      userCourses: [],
    };

    const result = userDashboardSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("userDashboardSchema should reject missing emails", () => {
    const invalidData = {
      name: "John Doe",
      userCourses: [],
    };

    const result = userDashboardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
