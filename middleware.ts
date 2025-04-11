import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isAdminLoginRoute = req.nextUrl.pathname === "/admin/login"

  // If accessing admin routes (except login) without being an admin, redirect to admin login
  if (isAdminRoute && !isAdminLoginRoute) {
    // Check if user is authenticated
    if (!session) {
      const redirectUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has admin role
    const userRole = session.user?.user_metadata?.role
    if (userRole !== "admin") {
      const redirectUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If accessing user dashboard without being authenticated, redirect to login
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    const redirectUrl = new URL("/auth/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Specify which routes the middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
