"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { SharedLoading } from "@/components/shared-loading"

// Add adminOnly prop to the component
export function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode
  adminOnly?: boolean
}) {
  const { isAuthenticated, userType, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
      } else if (adminOnly && userType !== "employee") {
        // If adminOnly is true and user is not an employee (admin), redirect to appropriate dashboard
        if (userType === "client") {
          router.push("/dashboard/client")
        } else {
          router.push("/dashboard/user")
        }
      }
    }
  }, [isAuthenticated, isLoading, router, adminOnly, userType])

  if (isLoading) {
    return <SharedLoading />
  }

  if (!isAuthenticated) {
    return null
  }

  if (adminOnly && userType !== "employee") {
    return null
  }

  return <>{children}</>
}

// Also add a default export for backward compatibility
export default ProtectedRoute
