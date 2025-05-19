import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for the ActionCable WebSocket
  if (request.nextUrl.pathname === "/cable") {
    // The JWT token will be passed as a query parameter
    // ActionCable will handle the authentication on the server side
    return NextResponse.next()
  }

  // For dashboard routes, check if user is admin
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Get the auth token and user type from cookies
    const authToken = request.cookies.get("auth_token")?.value
    const userType = request.cookies.get("user_type")?.value

    // If no auth token or user is not an employee (admin), redirect to login
    if (!authToken || userType !== "employee") {
      // Redirect to the appropriate login page
      return NextResponse.redirect(new URL("/auth/login/admin", request.url))
    }
  }

  // Protect client and employee login/signup routes
  if (
    request.nextUrl.pathname.startsWith("/auth/login/admin") ||
    request.nextUrl.pathname.startsWith("/auth/login/client") ||
    request.nextUrl.pathname.startsWith("/auth/register/admin") ||
    request.nextUrl.pathname.startsWith("/auth/register/client")
  ) {
    // Get the auth token and user type from cookies
    const authToken = request.cookies.get("auth_token")?.value
    const userType = request.cookies.get("user_type")?.value

    // If user is already authenticated, redirect to appropriate dashboard
    if (authToken) {
      if (userType === "employee") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url))
      } else if (userType === "client") {
        return NextResponse.redirect(new URL("/dashboard/client", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard/user", request.url))
      }
    }

    // Check if the request has a special header or query parameter for authorized access
    const hasAccess =
      request.headers.get("x-admin-access") === "true" || request.nextUrl.searchParams.has("admin_access")

    if (!hasAccess) {
      // Redirect unauthorized users to the main login page
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // For other routes, you can add authentication checks here
  // For now, we'll allow all requests to proceed
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/cable",
    "/dashboard/:path*",
    "/auth/login/admin",
    "/auth/login/client",
    "/auth/register/admin",
    "/auth/register/client",
  ],
}
