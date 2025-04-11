"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.user_metadata?.name || user.email}</CardTitle>
            <CardDescription>Your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is your personal dashboard where you can manage your account, view your orders, and more.
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track your recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You have no recent orders.</p>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Your recent messages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You have 1 unread message.</p>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                View Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user.user_metadata?.name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-sm text-muted-foreground capitalize">{user.user_metadata?.role || "user"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
