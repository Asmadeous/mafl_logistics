"use client"

import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useAppointments } from "@/hooks/use-appointments"
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Calendar, User } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserDashboardPage() {
  const { appointments, loading: appointmentsLoading } = useAppointments(false)
  const { stats, recentActivity, loading, error } = useDashboardData("user")

  // Initialize appointment notifications
  useAppointmentNotifications(appointments, "user")

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            View Profile
          </Button>
          <Button size="sm" className="whitespace-nowrap">
            Request Service
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Active Orders</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {recentActivity.filter((a) => a.type === "order" && a.status === "active").length || 2}
                </div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Upcoming Appointments</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading || appointmentsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{appointments.length || 1}</div>
                <p className="text-xs text-muted-foreground">
                  Next:{" "}
                  {appointments.length > 0
                    ? new Date(appointments[0].scheduledAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        hour: "numeric",
                        minute: "numeric",
                      })
                    : "Tomorrow, 10:00 AM"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Support Tickets</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {recentActivity.filter((a) => a.type === "support_ticket").length || 0}
                </div>
                <p className="text-xs text-muted-foreground">No active tickets</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Recent Activity</CardTitle>
          <CardDescription>Your recent interactions with MAFL Logistics</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[250px]" />
                      <Skeleton className="h-3 w-[100px] mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.slice(0, 3).map((activity) => {
                let icon
                switch (activity.type) {
                  case "order":
                    icon = <Package className="w-5 h-5 text-primary" />
                    break
                  case "appointment":
                    icon = <Calendar className="w-5 h-5 text-primary" />
                    break
                  default:
                    icon = <User className="w-5 h-5 text-primary" />
                }

                return (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{activity.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" asChild>
              <Link href="/dashboard/user/orders/new">
                <Package className="h-6 w-6 mb-2" />
                <span className="font-bold">Create New Order</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" asChild>
              <Link href="/dashboard/user/appointments/new">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="font-bold">Schedule Appointment</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" asChild>
              <Link href="/dashboard/user/support">
                <User className="h-6 w-6 mb-2" />
                <span className="font-bold">Contact Support</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
