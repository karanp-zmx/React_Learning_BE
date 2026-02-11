import type { Role, Status } from "@prisma/client";

/**
 * User entity type (matches Prisma User model).
 */
export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  status: Status;
  accessToken: string | null;
  tokenExpiry: Date | null;
  createdAt: Date;
}

/**
 * Login request body type.
 */
export interface LoginRequestBody {
  username: string;
  password: string;
}

/**
 * Create user/admin request body type.
 */
export interface CreateUserRequestBody {
  username: string;
  password: string;
}

/**
 * Auth user attached to request (after JWT verification).
 */
export interface AuthUser {
  userId: number;
  role: Role;
}
