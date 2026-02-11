import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/middleware/authMiddleware";
import type { Role } from "@prisma/client";

/**
 * Require authentication and one of the allowed roles.
 * Use in protected route handlers.
 * Returns error NextResponse (401/403) if unauthorized; returns null if authorized (caller should then use getAuthUser again or pass user).
 */
export async function requireAuthAndRole(
  request: NextRequest,
  allowedRoles: Role[]
): Promise<{ user: { userId: number; role: Role } } | { error: NextResponse }> {
  const authResult = await getAuthUser(request);

  if ("error" in authResult) {
    return { error: authResult.error };
  }

  const { user } = authResult;
  if (!allowedRoles.includes(user.role)) {
    console.log("[roleGuard] Forbidden: role", user.role, "not in", allowedRoles);
    return {
      error: NextResponse.json({ message: "Forbidden: insufficient permissions" }, { status: 403 }),
    };
  }

  return { user };
}

/**
 * Allow only ADMIN.
 */
export function allowAdmin(): Role[] {
  return ["ADMIN"];
}

/**
 * Allow both ADMIN and USER.
 */
export function allowUserAndAdmin(): Role[] {
  return ["ADMIN", "USER"];
}
