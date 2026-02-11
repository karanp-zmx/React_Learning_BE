import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const TOKEN_EXPIRY_MIN = parseInt(process.env.TOKEN_EXPIRY_MIN || "10", 10);

export interface JwtPayload {
  userId: number;
  role: Role;
  iat?: number;
  exp?: number;
}

/**
 * Generate a signed JWT for the user.
 * Expiry: 10 minutes (or TOKEN_EXPIRY_MIN from env).
 */
export function generateToken(userId: number, role: Role): string {
  const expiresIn = `${TOKEN_EXPIRY_MIN}m`;
  const token = jwt.sign(
    { userId, role } as JwtPayload,
    JWT_SECRET,
    { expiresIn }
  );
  console.log("[jwt] Token generated for userId:", userId, "expiresIn:", expiresIn);
  return token;
}

/**
 * Verify a JWT and decode payload. Returns null if invalid or expired.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    console.log("[jwt] Token verification failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Get token expiry Date (e.g. for storing in DB).
 */
export function getTokenExpiryDate(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + TOKEN_EXPIRY_MIN);
  return date;
}
