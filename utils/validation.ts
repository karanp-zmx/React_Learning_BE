import type { CreateStudentInput } from "@/types/student";
import type { ValidationErrors } from "@/types/student";

// Only alphabets (and spaces for name parts if needed – requirement says "only alphabets")
const ALPHABETS_ONLY = /^[a-zA-Z]+$/;
const ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_ONLY = /^\d+$/;

export interface ValidationResult {
  success: boolean;
  errors: ValidationErrors;
}

/**
 * Strict validation for student create/update input.
 * Returns { success: true, errors: {} } or { success: false, errors: { fieldName: "message" } }.
 */
export function validateStudentInput(data: Partial<CreateStudentInput>): ValidationResult {
  const errors: ValidationErrors = {};

  // firstName: required, min 2, only alphabets
  if (data.firstName === undefined || data.firstName === null || String(data.firstName).trim() === "") {
    errors.firstName = "First name is required";
  } else {
    const fn = String(data.firstName).trim();
    if (fn.length < 2) errors.firstName = "First name must be at least 2 characters";
    else if (!ALPHABETS_ONLY.test(fn)) errors.firstName = "First name must contain only alphabets";
  }

  // lastName: required, only alphabets
  if (data.lastName === undefined || data.lastName === null || String(data.lastName).trim() === "") {
    errors.lastName = "Last name is required";
  } else {
    const ln = String(data.lastName).trim();
    if (!ALPHABETS_ONLY.test(ln)) errors.lastName = "Last name must contain only alphabets";
  }

  // rollNumber: required, alphanumeric
  if (data.rollNumber === undefined || data.rollNumber === null || String(data.rollNumber).trim() === "") {
    errors.rollNumber = "Roll number is required";
  } else {
    const rn = String(data.rollNumber).trim();
    if (!ALPHANUMERIC.test(rn)) errors.rollNumber = "Roll number must be alphanumeric";
  }

  // class: required, max 10 chars
  if (data.class === undefined || data.class === null || String(data.class).trim() === "") {
    errors.class = "Class is required";
  } else {
    const c = String(data.class).trim();
    if (c.length > 10) errors.class = "Class must be at most 10 characters";
  }

  // division: required, max 5 chars
  if (data.division === undefined || data.division === null || String(data.division).trim() === "") {
    errors.division = "Division is required";
  } else {
    const d = String(data.division).trim();
    if (d.length > 5) errors.division = "Division must be at most 5 characters";
  }

  // email: required, valid email, must contain '@'
  if (data.email === undefined || data.email === null || String(data.email).trim() === "") {
    errors.email = "Email is required";
  } else {
    const e = String(data.email).trim();
    if (!e.includes("@")) errors.email = "Email must contain '@'";
    else if (!EMAIL_REGEX.test(e)) errors.email = "Email must be a valid email address";
  }

  // mobileNumber: required, exactly 10 digits, only numbers
  if (data.mobileNumber === undefined || data.mobileNumber === null || String(data.mobileNumber).trim() === "") {
    errors.mobileNumber = "Mobile number is required";
  } else {
    const m = String(data.mobileNumber).trim();
    if (!DIGITS_ONLY.test(m)) errors.mobileNumber = "Mobile number must contain only numbers";
    else if (m.length !== 10) errors.mobileNumber = "Mobile number must be exactly 10 digits";
  }

  // address: required, min 5 chars
  if (data.address === undefined || data.address === null || String(data.address).trim() === "") {
    errors.address = "Address is required";
  } else {
    const a = String(data.address).trim();
    if (a.length < 5) errors.address = "Address must be at least 5 characters";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}
