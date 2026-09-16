import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // protecting only the admin routes
  if (path.startsWith("/admin")) {
    const cookie = request.cookies.get("admin_session")?.value;
    const session = cookie ? await decrypt(cookie) : null;

    // If the session is missing, expired, or tampered with, kick them to login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// telling Next.js exactly which routes this middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
};
