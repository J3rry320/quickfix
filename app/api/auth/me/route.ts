import { NextRequest } from "next/server";
import { adminAuth, isAuthorizedAdmin } from "@/lib/firebase/admin";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session")?.value;

  if (!sessionCookie) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    let decoded;
    try {
      decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      decoded = await adminAuth.verifyIdToken(sessionCookie);
    }

    if (!decoded.email || !isAuthorizedAdmin(decoded.email)) {
      return apiError("Unauthorized admin email", 403, "FORBIDDEN");
    }

    return apiSuccess({
      user: {
        email: decoded.email,
        name: decoded.name || decoded.email.split("@")[0],
        picture: decoded.picture || null,
        uid: decoded.uid,
      },
    });
  } catch {
    return apiError("Invalid or expired session", 401, "INVALID_SESSION");
  }
}
