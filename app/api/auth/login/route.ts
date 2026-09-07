import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { apiSuccess, apiError, withApiProtection } from "@/lib/api/response";

async function loginHandler(request: NextRequest) {
  if (!adminAuth) {
    console.error("Firebase Auth Admin SDK is not initialized.");
    return apiError(
      "Authentication service unavailable",
      503,
      "AUTH_UNAVAILABLE"
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || !body.idToken) {
    return apiError("Missing idToken in request body", 400, "MISSING_TOKEN");
  }

  const { idToken } = body;

  try {
    // 1. Verify Google ID token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email?.toLowerCase();

    if (!email) {
      return apiError("Token does not contain an email", 400, "INVALID_TOKEN");
    }

    // 2. Check email against authorized admin emails
    const adminEmailsEnv =
      process.env.AUTH_EMAILS || process.env.ADMIN_EMAILS || "";
    const authorizedEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    if (!authorizedEmails.includes(email)) {
      console.warn(`Unauthorized login attempt by: ${email}`);
      return apiError(
        `Access denied: ${email} is not authorized for admin access.`,
        403,
        "UNAUTHORIZED_ADMIN"
      );
    }

    // 3. Create Session Cookie (5 days validity)
    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    let sessionToken = idToken;

    try {
      sessionToken = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });
    } catch {
      // If service account key is not present in dev, fallback to verified token
      sessionToken = idToken;
    }

    // 4. Return success and set secure HttpOnly cookie
    const response = apiSuccess({
      user: {
        email: decodedToken.email,
        name: decodedToken.name || email.split("@")[0],
        picture: decodedToken.picture || null,
        uid: decodedToken.uid,
      },
    });

    response.cookies.set({
      name: "admin_session",
      value: sessionToken,
      maxAge: 5 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[Auth Login Error]", err);
    return apiError(
      "Failed to verify authentication token",
      401,
      "AUTH_VERIFY_FAILED"
    );
  }
}

export const POST = withApiProtection(loginHandler, {
  rateLimitType: "auth",
  csrf: true,
});
