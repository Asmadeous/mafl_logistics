import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow ActionCable WebSocket requests
  if (request.nextUrl.pathname === "/cable") {
    return NextResponse.next();
  }

  // Allow all other requests; client-side auth will handle protection
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cable",
    "/dashboard/:path*",
    "/auth/login/:path*",
    "/auth/register/:path*",
  ],
};