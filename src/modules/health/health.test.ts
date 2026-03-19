import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import connectMongoDB from "../../shared/lib/mongoose";

describe("Health Check API", () => {
  beforeAll(async () => {
    await connectMongoDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /api/health should return 200 and status: ok", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
      },
    });
  });
});
