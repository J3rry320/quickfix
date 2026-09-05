import { NextRequest } from "next/server";

/**
 * Validates request origin and referer to protect against Cross-Site Request Forgery (CSRF).
 * For state-mutating methods (POST, PUT, DELETE, PATCH), checks:
 * 1. Matching host with Origin / Referer header
 * 2. Presence of custom anti-CSRF header (e.g. X-Requested-With or X-QuickFix-CSRF)
 */
export function validateCsrf(request: NextRequest): {
  valid: boolean;
  reason?: string;
} {
  const method = request.method.toUpperCase();

  // Safe methods do not mutate state
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { valid: true };
  }

  // 1. Check custom header (CORS preflight prevents cross-origin unauthorized headers)
  const hasCustomHeader =
    request.headers.get("x-requested-with") === "XMLHttpRequest" ||
    request.headers.has("x-csrf-token") ||
    request.headers.has("x-quickfix-csrf");

  if (hasCustomHeader) {
    return { valid: true };
  }

  // 2. Validate Origin header
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host");

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host === host) {
        return { valid: true };
      }
    } catch {
      return { valid: false, reason: "Malformed Origin header" };
    }
  }

  // 3. Fallback check Referer header
  const referer = request.headers.get("referer");
  if (referer && host) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host) {
        return { valid: true };
      }
    } catch {
      return { valid: false, reason: "Malformed Referer header" };
    }
  }

  // In development, allow localhost origins
  if (process.env.NODE_ENV === "development") {
    return { valid: true };
  }

  return {
    valid: false,
    reason: "Missing or mismatched Origin/Referer header",
  };
}
