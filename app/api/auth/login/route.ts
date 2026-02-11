import { NextRequest } from "next/server";
import { loginHandler } from "@/controllers/authController";

/**
 * POST /api/auth/login
 * Body: { "username": string, "password": string }
 * Returns: { role, status, access_Token, message } or { message: "Invalid credentials" }
 */
export async function POST(request: NextRequest) {
  console.log("[api/auth/login] POST request");
  return loginHandler(request);
}
