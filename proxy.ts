import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle Admin routes with session protection
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;

    // If on /admin/login and already authenticated, redirect to /admin dashboard
    if (pathname === "/admin/login") {
      if (sessionCookie) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Protected /admin routes: if not authenticated, redirect to login with return path
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Handle public marketing routes via next-intl
  return handleI18n(request);
}

export const config = {
  // Match all request paths except for
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - static files (e.g. /favicon.ico, robots.txt, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
