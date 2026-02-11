import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/userService";
import { errorResponse } from "@/utils/response";
import type { CreateUserRequestBody } from "@/types/user";

/**
 * Create new user (role USER). Admin only.
 */
export async function createUserHandler(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[userController] createUser request");

    let body: CreateUserRequestBody;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    const { username, password } = body;
    if (username === undefined || password === undefined) {
      return errorResponse("Username and password are required", 400);
    }

    const result = await createUser(
      typeof username === "string" ? username : String(username),
      typeof password === "string" ? password : String(password),
      "USER"
    );

    if (!result.success) {
      const status = result.message === "Username already exists" ? 409 : 400;
      return NextResponse.json({ message: result.message }, { status });
    }

    return NextResponse.json(
      {
        message: result.message,
        userId: result.userId,
        username: result.username,
        role: result.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[userController] createUser error:", error);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * Create new admin (role ADMIN). Admin only.
 */
export async function createAdminHandler(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[userController] createAdmin request");

    let body: CreateUserRequestBody;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    const { username, password } = body;
    if (username === undefined || password === undefined) {
      return errorResponse("Username and password are required", 400);
    }

    const result = await createUser(
      typeof username === "string" ? username : String(username),
      typeof password === "string" ? password : String(password),
      "ADMIN"
    );

    if (!result.success) {
      const status = result.message === "Username already exists" ? 409 : 400;
      return NextResponse.json({ message: result.message }, { status });
    }

    return NextResponse.json(
      {
        message: result.message,
        userId: result.userId,
        username: result.username,
        role: result.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[userController] createAdmin error:", error);
    return errorResponse("Internal server error", 500);
  }
}
