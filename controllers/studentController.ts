import { NextRequest, NextResponse } from "next/server";
import { createStudent, getAllStudents } from "@/services/studentService";

/**
 * Create student – call service, return JSON success or validation/error response.
 */
export async function createStudentController(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[studentController] createStudent request");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: { body: "Invalid JSON" } },
        { status: 400 }
      );
    }

    const result = await createStudent(body as Record<string, unknown>);

    if (!result.success) {
      const status = result.errors ? 400 : 500;
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          ...(result.errors && { errors: result.errors }),
        },
        { status }
      );
    }

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("[studentController] createStudent error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Get all students – return array in standard format.
 */
export async function getAllStudentsController(): Promise<NextResponse> {
  try {
    console.log("[studentController] getAllStudents request");
    const result = await getAllStudents();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message ?? "Failed to fetch students", data: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[studentController] getAllStudents error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}
