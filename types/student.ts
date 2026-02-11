/**
 * Student entity type (matches Prisma StudentDetails model).
 */
export interface Student {
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
}

/**
 * Request body for creating a student.
 */
export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  rollNumber: string;
  class: string;
  division: string;
  email: string;
  mobileNumber: string;
  address: string;
}

/**
 * Validation errors map (field name -> error message).
 */
export interface ValidationErrors {
  [field: string]: string;
}
