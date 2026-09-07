import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminAuth } from "@/lib/firebase/admin";
import { apiError, getClientIp } from "./response";
import { validateCsrf } from "./csrf";
import { checkRateLimit } from "./rate-limit";
import { connectToDatabase } from "@/lib/mongodb";

// Re-export Public API wrappers from dedicated module for full backward compatibility
export {
  withPublicApi,
  type PublicHandlerContext,
  type PublicRouteHandler,
} from "./public";

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  picture: string | null;
}

/**
 * Extracts and verifies the admin session from cookies or Bearer Authorization header.
 * Validates that the user's email is on the authorized allowlist (AUTH_EMAILS).
 */
export async function getAuthenticatedAdmin(
  request: NextRequest
): Promise<AdminUser | null> {
  const auth = getAdminAuth();
  if (!auth) {
    console.error("Firebase Auth Admin SDK is not initialized.");
    return null;
  }

  const sessionCookie =
    request.cookies.get("admin_session")?.value ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!sessionCookie) return null;

  try {
    let decoded;
    try {
      decoded = await auth.verifySessionCookie(sessionCookie, true);
    } catch {
      decoded = await auth.verifyIdToken(sessionCookie);
    }

    const email = decoded.email?.toLowerCase();
    if (!email) return null;

    // Check against authorized admin emails
    const adminEmailsEnv =
      process.env.AUTH_EMAILS || process.env.ADMIN_EMAILS || "";
    const authorizedEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    if (!authorizedEmails.includes(email)) {
      console.warn(`Unauthorized admin access attempt by: ${email}`);
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email!,
      name: decoded.name || decoded.email!.split("@")[0],
      picture: decoded.picture || null,
    };
  } catch {
    return null;
  }
}

export interface AdminHandlerContext<P = Record<string, string>> {
  user: AdminUser;
  params: P;
}

export type AdminRouteHandler<P = Record<string, string>> = (
  request: NextRequest,
  context: AdminHandlerContext<P>
) => Promise<NextResponse>;

/**
 * High-order wrapper for Admin protected API routes.
 * Enforces:
 * 1. CSRF token/origin checks on mutating methods
 * 2. Rate limiting (general tier)
 * 3. Session cookie or Bearer token verification with email allowlist check
 * 4. Automatic MongoDB connection
 * 5. Structured Zod and unhandled error handling
 */
export function withAdminAuth<P = Record<string, string>>(
  handler: AdminRouteHandler<P>,
  options: { csrf?: boolean } = { csrf: true }
) {
  return async (
    request: NextRequest,
    context: { params: Promise<P> }
  ): Promise<NextResponse> => {
    // 1. CSRF Check on mutating methods
    if (
      options.csrf &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
    ) {
      const csrfCheck = validateCsrf(request);
      if (!csrfCheck.valid) {
        return apiError("CSRF validation failed", 403, "CSRF_ERROR");
      }
    }

    // 2. Rate Limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, "general");
    if (!rateLimit.success) {
      return apiError(
        "Too many requests, please try again later",
        429,
        "RATE_LIMITED"
      );
    }

    // 3. Admin Authentication & Allowlist
    const user = await getAuthenticatedAdmin(request);
    if (!user) {
      return apiError("Unauthorized admin access", 401, "UNAUTHORIZED");
    }

    // 4. Connect to Database
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

    // 5. Execute handler
    try {
      const resolvedParams = context?.params ? await context.params : ({} as P);

      const response = await handler(request, {
        user,
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
      console.error("[Admin API Handler Error]", error);
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
