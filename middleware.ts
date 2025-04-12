import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verification",
    "/blog",
    "/services",
    "/about",
    "/contact",
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith("/blog/") || path.startsWith("/api/"),
  )

  // Check if the path is an admin path
  const isAdminPath = path.startsWith("/admin")

  // Get authentication token from cookies
  const authToken = request.cookies.get("auth_token")?.value
  const isAdminToken = request.cookies.get("is_admin")?.value === "true"

  // If the path is not public and there's no auth token, redirect to login
  if (!isPublicPath && !authToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If the path is admin and the user is not an admin, redirect to dashboard
  if (isAdminPath && !isAdminToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|images|videos).*)",
  ],
}
