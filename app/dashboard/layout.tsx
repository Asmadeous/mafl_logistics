import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { NotificationWrapper } from "@/components/dashboard/notification-wrapper"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute adminOnly={true}>
      <NotificationWrapper />
      {children}
    </ProtectedRoute>
  )
}
