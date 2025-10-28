import { describe, it, expect, beforeAll } from "vitest";
import { generateToken, verifyToken } from "./jwt";

describe("JWT Utils", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("should generate a valid JWT token", () => {
    const payload = { userId: 1, role: "user" };
    const token = generateToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should verify a valid JWT token", () => {
    const payload = { userId: 1, role: "user" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it("should throw error for invalid token", () => {
    const invalidToken = "invalid.token.here";
    expect(() => verifyToken(invalidToken)).toThrow();
  });
});
