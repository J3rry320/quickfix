/* eslint-disable @typescript-eslint/no-require-imports */
import type { Auth } from "firebase-admin/auth";
import type { App } from "firebase-admin/app";

let cachedApp: App | null = null;
let cachedAuth: Auth | null = null;

/**
 * Lazily initializes and returns the Firebase Admin Auth instance.
 * Avoids executing firebase-admin or throwing unhandled errors at module load time.
 */
export function getAdminAuth(): Auth | null {
  if (cachedAuth) {
    return cachedAuth;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    console.warn(
      "[Firebase Admin] Missing required environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY."
    );
    return null;
  }

  try {
    // Dynamically require to avoid loading firebase-admin unless explicitly invoked
    const { initializeApp, getApps, getApp, cert } = require("firebase-admin/app");
    const { getAuth } = require("firebase-admin/auth");

    // Clean and normalize the private key
    let privateKey = rawPrivateKey.trim();
    if (
      (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
      (privateKey.startsWith("'") && privateKey.endsWith("'"))
    ) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    cachedApp =
      getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
            projectId,
          })
        : getApp();

    cachedAuth = getAuth(cachedApp);
    return cachedAuth;
  } catch (error) {
    console.error("[Firebase Admin] Failed to initialize Firebase Admin SDK:", error);
    return null;
  }
}

/**
 * Proxy object for adminAuth that initializes on demand.
 * Maintains full backward compatibility with `adminAuth.verifyIdToken(...)`, etc.
 */
export const adminAuth: Auth | null = new Proxy({} as Auth, {
  get(_target, prop: string | symbol) {
    const auth = getAdminAuth();
    if (!auth) {
      return undefined;
    }
    const value = (auth as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(auth) : value;
  },
});
