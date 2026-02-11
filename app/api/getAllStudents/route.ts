import { NextRequest } from "next/server";
import { requireAuthAndRole, allowUserAndAdmin } from "@/middleware/roleGuard";
import { getAllStudentsController } from "@/controllers/studentController";

/**
 * GET /api/getAllStudents
 * Get all students. ADMIN and USER.
 */
export async function GET(request: NextRequest) {
  console.log("[api/getAllStudents] GET request");

  const result = await requireAuthAndRole(request, allowUserAndAdmin());
  if ("error" in result) {
    return result.error;
  }

  return getAllStudentsController();
}
