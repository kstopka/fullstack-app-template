import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import { authMiddleware } from "./authMiddleware";
import { generateToken } from "../utils/jwt";

const app = express();
app.use(express.json());

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected content", user: req.user });
});

describe("Auth Middleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("should allow access with valid token", async () => {
    const token = generateToken({ userId: 1, role: "user" });
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Protected content");
    expect(response.body.user.userId).toBe(1);
    expect(response.body.user.role).toBe("user");
  });

  it("should reject access without token", async () => {
    const response = await request(app).get("/protected");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token");
  });

  it("should reject access with invalid token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid.token.here");
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Invalid token");
  });
});
