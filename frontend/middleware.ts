import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_token");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  if (!authCookie && !isAuthRoute && !isApiRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (authCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api routes that handle their own auth
     * - /_next (static files)
     * - /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!_next|favicon.ico|sitemap.xml).*)",
  ],
};
