import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "./rate-limit";
import { validateCsrf } from "./csrf";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
  };
}

export function apiSuccess<T>(
  data: T,
  status = 200,
  headers?: HeadersInit
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status, headers }
  );
}

export function apiError(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Extracts client IP from request headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

export interface ApiProtectionOptions {
  rateLimitType?: "auth" | "general";
  csrf?: boolean;
}

/**
 * Wraps an API route handler with Rate Limiting, CSRF validation, and error handling.
 */
export function withApiProtection(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: ApiProtectionOptions = { rateLimitType: "general", csrf: true }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // 1. CSRF Protection
    if (options.csrf) {
      const csrfCheck = validateCsrf(request);
      if (!csrfCheck.valid) {
        return apiError("CSRF validation failed", 403, "CSRF_ERROR");
      }
    }

    // 2. Rate Limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, options.rateLimitType || "general");

    if (!rateLimit.success) {
      return apiError(
        "Too many requests, please try again later",
        429,
        "RATE_LIMITED"
      );
    }

    // 3. Execute Handler with Global Error Boundary
    try {
      const response = await handler(request);

      // Add rate limit headers
      response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
      response.headers.set(
        "X-RateLimit-Remaining",
        String(rateLimit.remaining)
      );
      response.headers.set("X-RateLimit-Reset", String(rateLimit.reset));

      return response;
    } catch (error) {
      console.error("[API Error]", error);
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      return apiError(message, 500, "INTERNAL_SERVER_ERROR");
    }
  };
}
