import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /** Always allow API routes — otherwise login POST is redirected to HTML and cookies never set */
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    const hasSession = !!request.cookies.get("cps_session")?.value;
    if (hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const hasSession = !!request.cookies.get("cps_session")?.value;
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_not-found|favicon.ico|logo.png|api).*)"],
};
