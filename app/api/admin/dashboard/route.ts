import { NextRequest, NextResponse } from "next/server";
import { requireAuthAndRole, allowAdmin } from "@/middleware/roleGuard";

/**
 * GET /api/admin/dashboard
 * Only ADMIN allowed. Requires Authorization: Bearer <token>.
 */
export async function GET(request: NextRequest) {
  console.log("[api/admin/dashboard] GET request");

  const result = await requireAuthAndRole(request, allowAdmin());
  if ("error" in result) {
    return result.error;
  }

  const { user } = result;
  console.log("[api/admin/dashboard] Authorized userId:", user.userId);

  return NextResponse.json({
    message: "Welcome to Admin Dashboard",
    userId: user.userId,
    role: user.role,
  });
}
