import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const cookie = request.cookies.get("admin_session")?.value;
    const session = cookie ? await decrypt(cookie) : null;

    // if a random person guesses link silently bounce them to the homepage.
    // this part hides the existence of secret login route
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
