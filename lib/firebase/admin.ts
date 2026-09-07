import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  // Graceful fallback for build step or initial development before env config
  throw new Error("Firebase Admin environment variables are not fully set.");
}

let app;

if (projectId && clientEmail && privateKey) {
  try {
    app =
      getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, "\n"),
            }),
          })
        : getApp();
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

export const adminAuth = app ? getAuth(app) : null;
