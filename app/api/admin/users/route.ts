import { NextRequest, NextResponse } from "next/server";
import { requireAuthAndRole, allowAdmin } from "@/middleware/roleGuard";
import { createUserHandler } from "@/controllers/userController";

/**
 * POST /api/admin/users
 * Create a new user (role USER). Only ADMIN allowed.
 * Body: { "username": string, "password": string }
 */
export async function POST(request: NextRequest) {
  console.log("[api/admin/users] POST request");

  const result = await requireAuthAndRole(request, allowAdmin());
  if ("error" in result) {
    return result.error;
  }

  return createUserHandler(request);
}
