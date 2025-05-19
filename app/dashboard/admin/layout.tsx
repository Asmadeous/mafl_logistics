import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute requiredUserType="employee" requiredRole="admin">
      {children}
    </ProtectedRoute>
  )
}
