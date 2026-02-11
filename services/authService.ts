import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/utils/hash";
import { generateToken, getTokenExpiryDate } from "@/utils/jwt";
import type { Role, Status } from "@prisma/client";

export interface LoginResult {
  success: boolean;
  message: string;
  role?: Role;
  status?: Status;
  accessToken?: string;
}

/**
 * Login: find user, compare password, check status, generate JWT, store token + expiry in DB.
 */
export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    console.log("[authService] login called for username:", username);

    if (!username?.trim() || !password) {
      return { success: false, message: "Username and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      console.log("[authService] User not found:", username);
      return { success: false, message: "Invalid credentials" };
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      console.log("[authService] Invalid password for:", username);
      return { success: false, message: "Invalid credentials" };
    }

    if (user.status !== "ACTIVE") {
      console.log("[authService] User inactive:", username);
      return { success: false, message: "Account is inactive" };
    }

    const accessToken = generateToken(user.id, user.role);
    const tokenExpiry = getTokenExpiryDate();

    await prisma.user.update({
      where: { id: user.id },
      data: { accessToken, tokenExpiry },
    });

    console.log("[authService] Login success for:", username, "role:", user.role);

    return {
      success: true,
      message: "Login success",
      role: user.role,
      status: user.status,
      accessToken,
    };
  } catch (error) {
    console.error("[authService] login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}
