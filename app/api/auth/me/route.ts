import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const auth = getAdminAuth();
  if (!auth) {
    return apiError("Authentication service unavailable", 503, "AUTH_UNAVAILABLE");
  }

  const sessionCookie = request.cookies.get("admin_session")?.value;

  if (!sessionCookie) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    let decoded;
    try {
      decoded = await auth.verifySessionCookie(sessionCookie, true);
    } catch {
      decoded = await auth.verifyIdToken(sessionCookie);
    }

    const email = decoded.email?.toLowerCase();
    if (!email) {
      return apiError("Unauthorized admin email", 403, "FORBIDDEN");
    }

    // Check against authorized admin emails
    const adminEmailsEnv =
      process.env.AUTH_EMAILS || process.env.ADMIN_EMAILS || "";
    const authorizedEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    if (!authorizedEmails.includes(email)) {
      return apiError("Unauthorized admin email", 403, "FORBIDDEN");
    }

    return apiSuccess({
      user: {
        email: decoded.email,
        name: decoded.name || decoded.email!.split("@")[0],
        picture: decoded.picture || null,
        uid: decoded.uid,
      },
    });
  } catch {
    return apiError("Invalid or expired session", 401, "INVALID_SESSION");
  }
}
