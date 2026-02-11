import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/hash";
import type { Role } from "@prisma/client";

export interface CreateUserResult {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
  role?: Role;
}

/**
 * Create a new user with the given role (USER or ADMIN).
 * Only call this from admin-protected routes.
 */
export async function createUser(
  username: string,
  password: string,
  role: Role
): Promise<CreateUserResult> {
  try {
    console.log("[userService] createUser called:", { username, role });

    const trimmedUsername = username?.trim();
    if (!trimmedUsername || !password) {
      return { success: false, message: "Username and password are required" };
    }

    if (password.length < 4) {
      return { success: false, message: "Password must be at least 4 characters" };
    }

    const existing = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });

    if (existing) {
      console.log("[userService] Username already exists:", trimmedUsername);
      return { success: false, message: "Username already exists" };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: trimmedUsername,
        password: hashedPassword,
        role,
        status: "ACTIVE",
      },
    });

    console.log("[userService] User created:", user.id, user.username, user.role);

    return {
      success: true,
      message: role === "ADMIN" ? "Admin created successfully" : "User created successfully",
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    console.error("[userService] createUser error:", error);
    return { success: false, message: "Failed to create user" };
  }
}
