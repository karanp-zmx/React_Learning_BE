import { NextRequest, NextResponse } from "next/server";
import { requireAuthAndRole, allowAdmin } from "@/middleware/roleGuard";
import { createAdminHandler } from "@/controllers/userController";

/**
 * POST /api/admin/admins
 * Create a new admin (role ADMIN). Only ADMIN allowed.
 * Body: { "username": string, "password": string }
 */
export async function POST(request: NextRequest) {
  console.log("[api/admin/admins] POST request");

  const result = await requireAuthAndRole(request, allowAdmin());
  if ("error" in result) {
    return result.error;
  }

  return createAdminHandler(request);
}
