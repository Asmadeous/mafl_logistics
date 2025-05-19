import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ClientDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ProtectedRoute requiredUserType="client">{children}</ProtectedRoute>
}
