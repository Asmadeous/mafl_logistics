import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ProtectedRoute requiredUserType="user">{children}</ProtectedRoute>
}
