import { NextRequest } from "next/server";
import { requireAuthAndRole, allowAdmin } from "@/middleware/roleGuard";
import { createStudentController } from "@/controllers/studentController";

/**
 * POST /api/createStudent
 * Create a new student. ADMIN only.
 * Body: { firstName, lastName, rollNumber, class, division, email, mobileNumber, address }
 */
export async function POST(request: NextRequest) {
  console.log("[api/createStudent] POST request");

  const result = await requireAuthAndRole(request, allowAdmin());
  if ("error" in result) {
    return result.error;
  }

  return createStudentController(request);
}
