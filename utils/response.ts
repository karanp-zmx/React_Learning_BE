import { NextResponse } from "next/server";

/**
 * Standard API success response.
 */
export function successResponse<T = unknown>(
  message: string,
  data?: T,
  status: number = 200
): NextResponse {
  const body = data !== undefined ? { success: true, message, data } : { success: true, message };
  return NextResponse.json(body, { status });
}

/**
 * Standard API error response.
 */
export function errorResponse(
  message: string,
  status: number = 400
): NextResponse {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}
