import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError, getClientIp } from "./response";
import { validateCsrf } from "./csrf";
import { checkRateLimit } from "./rate-limit";
import { connectToDatabase } from "@/lib/mongodb";

export interface PublicHandlerContext<P = Record<string, string>> {
  params: P;
}

export type PublicRouteHandler<P = Record<string, string>> = (
  request: NextRequest,
  context: PublicHandlerContext<P>
) => Promise<NextResponse>;

/**
 * High-order wrapper for Public API routes.
 * Decoupled from any authentication or Firebase Admin SDK.
 * Enforces:
 * 1. CSRF validation on POST
 * 2. Rate limiting (supports custom type or general rate limiting)
 * 3. Automatic MongoDB connection
 * 4. Structured Zod and unhandled error handling
 */
export function withPublicApi<P = Record<string, string>>(
  handler: PublicRouteHandler<P>,
  options: {
    csrf?: boolean;
    rateLimitType?: "auth" | "general";
  } = { csrf: true, rateLimitType: "general" }
) {
  return async (
    request: NextRequest,
    context?: { params: Promise<P> }
  ): Promise<NextResponse> => {
    // 1. CSRF Check on POST
    if (options.csrf && request.method === "POST") {
      const csrfCheck = validateCsrf(request);
      if (!csrfCheck.valid) {
        return apiError("CSRF validation failed", 403, "CSRF_ERROR");
      }
    }

    // 2. Rate Limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(
      ip,
      options.rateLimitType || "general"
    );
    if (!rateLimit.success) {
      return apiError(
        "Too many requests, please try again later",
        429,
        "RATE_LIMITED"
      );
    }

    // 3. Connect to Database
    try {
      await connectToDatabase();
    } catch (dbErr) {
      console.error("[Database Connection Error]", dbErr);
      return apiError(
        "Database connection unavailable",
        503,
        "DATABASE_ERROR"
      );
    }

    // 4. Execute handler
    try {
      const resolvedParams = context?.params ? await context.params : ({} as P);

      const response = await handler(request, {
        params: resolvedParams,
      });

      response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
      response.headers.set(
        "X-RateLimit-Remaining",
        String(rateLimit.remaining)
      );
      response.headers.set("X-RateLimit-Reset", String(rateLimit.reset));

      return response;
    } catch (error) {
      console.error("[Public API Handler Error]", error);
      if (error instanceof ZodError) {
        return apiError(
          "Validation error",
          400,
          "VALIDATION_ERROR",
          error.issues
        );
      }
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      return apiError(message, 500, "INTERNAL_SERVER_ERROR");
    }
  };
}
