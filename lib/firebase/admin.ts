import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

function initFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "quickfix-admin";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  }

  // Fallback initialization for build-time and environments without live service account
  return initializeApp({
    projectId,
  });
}

export const adminApp: App = initFirebaseAdmin();
export const adminAuth: Auth = getAuth(adminApp);

/**
 * Checks if the given email is in the authorized admin emails list.
 * Configured via AUTH_EMAILS or ADMIN_EMAILS environment variable (comma-separated).
 */
export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;

  const rawAuthEmails =
    process.env.AUTH_EMAILS || process.env.ADMIN_EMAILS || "";

  const allowedEmails = rawAuthEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase());
}
