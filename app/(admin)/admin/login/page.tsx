"use client";

import { clientSignOut, signInWithGoogle } from "@/lib/firebase/client";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from") || "/admin";

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Sign in with Google via Firebase Client SDK
      const credential = await signInWithGoogle();
      const idToken = await credential.user.getIdToken();

      // 2. Call backend Auth API with CSRF header
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-QuickFix-CSRF": "1",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Sign out on client if unauthorized
        await clientSignOut();
        const errorMessage =
          data.error?.message ||
          "Access denied: Your Google account is not authorized as an admin.";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // 3. Redirect to Admin Dashboard upon successful verification
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      console.error("[Login Error]", err);
      await clientSignOut();
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-clean-white p-8 shadow-xl border border-zinc-200">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-flash-orange text-clean-white shadow-md mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="font-heading text-2xl font-extrabold text-tech-slate">
          Quick<span className="text-flash-orange">Fix</span> Admin
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Protected Staff & Operations Area
        </p>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 border border-red-200 text-left animate-in fade-in">
          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800">
            <p className="font-bold">Authentication Failed</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-clean-white px-5 py-3.5 text-sm font-bold text-tech-slate shadow-xs hover:bg-zinc-50 hover:border-zinc-400 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-flash-orange" />
              <span>Verifying Admin Credentials...</span>
            </>
          ) : (
            <>
              {/* Google Colored Logo */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}

      {/* Return to website */}
      <div className="mt-8 pt-4 border-t border-zinc-200 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-flash-orange transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to QuickFix.in Website</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-mist-gray">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-flash-orange" />
            <span>Loading admin portal...</span>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
