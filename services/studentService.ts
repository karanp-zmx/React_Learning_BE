import { prisma } from "@/lib/prisma";
import { validateStudentInput } from "@/utils/validation";
import type { CreateStudentInput } from "@/types/student";
import type { ValidationErrors } from "@/types/student";

export interface CreateStudentResult {
  success: boolean;
  message: string;
  errors?: ValidationErrors;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    rollNumber: string;
    class: string;
    division: string;
    email: string;
    mobileNumber: string;
    address: string;
    createdAt: Date;
  };
}

/**
 * Validate input, check duplicate rollNumber/email, insert using Prisma.
 */
export async function createStudent(data: Partial<CreateStudentInput>): Promise<CreateStudentResult> {
  try {
    console.log("[studentService] createStudent called");

    const validation = validateStudentInput(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation error",
        errors: validation.errors,
      };
    }

    const payload = data as CreateStudentInput;
    const rollNumber = String(payload.rollNumber).trim();
    const email = String(payload.email).trim();

    const existingRoll = await prisma.studentDetails.findUnique({
      where: { rollNumber },
    });
    if (existingRoll) {
      return {
        success: false,
        message: "Validation error",
        errors: { rollNumber: "Roll number already exists" },
      };
    }

    const existingEmail = await prisma.studentDetails.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return {
        success: false,
        message: "Validation error",
        errors: { email: "Email already exists" },
      };
    }

    const student = await prisma.studentDetails.create({
      data: {
        firstName: String(payload.firstName).trim(),
        lastName: String(payload.lastName).trim(),
        rollNumber,
        class: String(payload.class).trim(),
        division: String(payload.division).trim(),
        email,
        mobileNumber: String(payload.mobileNumber).trim(),
        address: String(payload.address).trim(),
      },
    });

    console.log("[studentService] Student created:", student.id);

    return {
      success: true,
      message: "Student created successfully",
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.rollNumber,
        class: student.class,
        division: student.division,
        email: student.email,
        mobileNumber: student.mobileNumber,
        address: student.address,
        createdAt: student.createdAt,
      },
    };
  } catch (error) {
    console.error("[studentService] createStudent error:", error);
    return { success: false, message: "Failed to create student" };
  }
}

/**
 * Fetch all students using Prisma findMany.
 */
export async function getAllStudents() {
  try {
    console.log("[studentService] getAllStudents called");
    const students = await prisma.studentDetails.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: students };
  } catch (error) {
    console.error("[studentService] getAllStudents error:", error);
    return { success: false, data: [] as unknown[], message: "Failed to fetch students" };
  }
}
