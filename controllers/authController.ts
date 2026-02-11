import { NextRequest, NextResponse } from "next/server";
import { login } from "@/services/authService";
import { errorResponse } from "@/utils/response";
import type { LoginRequestBody } from "@/types/user";

/**
 * Auth controller – handles HTTP layer and delegates to auth service.
 * Returns exact JSON format: role, status, access_Token, message.
 */

export async function loginHandler(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[authController] login request received");

    let body: LoginRequestBody;
    try {
      body = await request.json();
    } catch {
      console.log("[authController] Invalid JSON body");
      return errorResponse("Invalid request body", 400);
    }

    const { username, password } = body;

    if (username === undefined || password === undefined) {
      console.log("[authController] Missing username or password in body");
      return errorResponse("Username and password are required", 400);
    }

    const result = await login(
      typeof username === "string" ? username : String(username),
      typeof password === "string" ? password : String(password)
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        role: result.role,
        status: result.status,
        access_Token: result.accessToken,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[authController] login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
