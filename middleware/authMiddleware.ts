import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";
import type { AuthUser } from "@/types/user";
import type { Role } from "@prisma/client";

/**
 * Extract Bearer token from Authorization header.
 */
export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7).trim() || null;
}

/**
 * Verify Bearer token, check expiry, and load user from DB.
 * Returns AuthUser if valid; otherwise returns error NextResponse.
 */
export async function getAuthUser(request: NextRequest): Promise<
  | { user: AuthUser }
  | { error: NextResponse }
> {
  const token = getBearerToken(request);
  if (!token) {
    console.log("[authMiddleware] No Bearer token");
    return {
      error: NextResponse.json({ message: "Authorization header required" }, { status: 401 }),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    console.log("[authMiddleware] Invalid or expired token");
    return {
      error: NextResponse.json({ message: "Invalid or expired token" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, status: true, accessToken: true, tokenExpiry: true },
  });

  if (!user || user.status !== "ACTIVE") {
    console.log("[authMiddleware] User not found or inactive");
    return {
      error: NextResponse.json({ message: "User not found or inactive" }, { status: 401 }),
    };
  }

  if (user.accessToken !== token || !user.tokenExpiry || new Date() > user.tokenExpiry) {
    console.log("[authMiddleware] Token mismatch or expired in DB");
    return {
      error: NextResponse.json({ message: "Token expired or invalid" }, { status: 401 }),
    };
  }

  return {
    user: { userId: user.id, role: user.role },
  };
}

/**
 * Attach user to request (for use in route handlers).
 * Use getAuthUser() to obtain user; then pass to roleGuard.
 */
export type RequestWithAuth = NextRequest & { authUser?: AuthUser };
