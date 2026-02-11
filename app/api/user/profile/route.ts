import { NextRequest, NextResponse } from "next/server";
import { requireAuthAndRole, allowUserAndAdmin } from "@/middleware/roleGuard";

/**
 * GET /api/user/profile
 * Both ADMIN and USER allowed. Requires Authorization: Bearer <token>.
 */
export async function GET(request: NextRequest) {
  console.log("[api/user/profile] GET request");

  const result = await requireAuthAndRole(request, allowUserAndAdmin());
  if ("error" in result) {
    return result.error;
  }

  const { user } = result;
  console.log("[api/user/profile] Authorized userId:", user.userId);

  return NextResponse.json({
    message: "User profile",
    userId: user.userId,
    role: user.role,
  });
}
